#include <gui/gamescreen_screen/GameScreenView.hpp>
#include <touchgfx/Color.hpp>
#include "stm32f4xx_hal.h"

GameScreenView::GameScreenView()
{
    resetTimer = 0;
    resetTimerActive = false;
    randomSeed = 12345; // Khởi tạo seed cho random
}

void GameScreenView::setupScreen()
{
    GameScreenViewBase::setupScreen();
    initGPIO();

    // Khởi tạo trạng thái game
    playerHP = 100;
    aiHP = 100;
    playerChakraLevel = 0;
    aiChakraLevel = 0;
    menuOpen = false;
    gameEnded = false;

    // Khởi tạo combat state
    playerDefending = false;
    aiDefending = false;
    playerSpecialUsed = false;
    aiSpecialUsed = false;

    // Khởi tạo AI personality ngẫu nhiên
    int personalityRoll = generateRandomNumber(1, 100);
    if (personalityRoll <= 70) {
        aiPersonality = 0; // Aggressive
    } else if (personalityRoll <= 90) {
        aiPersonality = 1; // Defensive
    } else {
        aiPersonality = 2; // Random
    }

    // Khởi tạo timer
    resetTimer = 0;
    resetTimerActive = false;
    gameEndTimer = 0;
    gameEndTimerActive = false;

    // Cập nhật UI ban đầu
    updatePlayerHPDisplay();
    updateAIHPDisplay();
    updatePlayerChakraDisplay();
    updateAIChakraDisplay();

    // Đảm bảo cả hai nhân vật ở trạng thái bình thường khi bắt đầu
    resetNarutoState();
    resetBleachState();
}

void GameScreenView::tearDownScreen()
{
    GameScreenViewBase::tearDownScreen();
}

void GameScreenView::initGPIO()
{
    __HAL_RCC_GPIOG_CLK_ENABLE();

    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOG, &GPIO_InitStruct);

    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_13, GPIO_PIN_RESET);
}

void GameScreenView::toggleLED()
{
    HAL_GPIO_TogglePin(GPIOG, GPIO_PIN_13);
}

void GameScreenView::hideActionButtons()
{
    btn_attack.setVisible(false);
    btn_def.setVisible(false);
    btn_spe.setVisible(false);
    btn_arrow1.setVisible(true);
    btn_arrow2.setVisible(false);

    btn_attack.invalidate();
    btn_def.invalidate();
    btn_spe.invalidate();
    btn_arrow1.invalidate();
    btn_arrow2.invalidate();

    menuOpen = false;
}

void GameScreenView::showActionButtons()
{
    btn_attack.setVisible(true);
    btn_def.setVisible(true);
    btn_spe.setVisible(true);
    btn_arrow1.setVisible(false);
    btn_arrow2.setVisible(true);

    btn_attack.invalidate();
    btn_def.invalidate();
    btn_spe.invalidate();
    btn_arrow1.invalidate();
    btn_arrow2.invalidate();

    menuOpen = true;
}

void GameScreenView::toggleActionMenu()
{
    if (menuOpen) {
        hideActionButtons();
    } else {
        showActionButtons();
    }
    toggleLED();
}

void GameScreenView::handleClickEvent(const ClickEvent& evt)
{
    if (evt.getType() == ClickEvent::PRESSED)
    {
        // Bấm arrow1 (mở menu)
        if (btn_arrow1.getAbsoluteRect().intersect(evt.getX(), evt.getY()))
        {
            toggleActionMenu();
            return;
        }

        // Bấm arrow2 (đóng menu)
        if (btn_arrow2.getAbsoluteRect().intersect(evt.getX(), evt.getY()))
        {
            toggleActionMenu();
            return;
        }

        // CÁC NÚT ACTION VỚI LOGIC COMBAT THẬT
        if (menuOpen && !gameEnded) {
            if (btn_attack.getAbsoluteRect().intersect(evt.getX(), evt.getY()))
            {
                playerAttack();
                if (!gameEnded) performAIAction();
                checkGameEnd();
            }
            if (btn_def.getAbsoluteRect().intersect(evt.getX(), evt.getY()))
            {
                playerDefend();
                if (!gameEnded) performAIAction();
                checkGameEnd();
            }
            if (btn_spe.getAbsoluteRect().intersect(evt.getX(), evt.getY()))
            {
                if (canUseSpecial(true)) {
                    playerSpecial();
                    if (!gameEnded) performAIAction();
                    checkGameEnd();
                }
            }
        }
    }

    GameScreenViewBase::handleClickEvent(evt);
}

void GameScreenView::handleDragEvent(const DragEvent& evt)
{
    GameScreenViewBase::handleDragEvent(evt);
}

void GameScreenView::handleTickEvent()
{
    // Xử lý timer auto reset
    if (resetTimerActive)
    {
        resetTimer += 16; // TouchGFX thường chạy ở 60fps, mỗi tick ~16ms

        if (resetTimer >= RESET_TIME_MS)
        {
            resetNarutoState();
            resetBleachState();
            resetTimerActive = false;
            resetTimer = 0;

            // Reset trạng thái defend sau mỗi turn (chỉ khi game chưa kết thúc)
            if (!gameEnded) {
                playerDefending = false;
                aiDefending = false;
                playerSpecialUsed = false;
                aiSpecialUsed = false;
            }
        }
    }

    // Xử lý timer game end
    if (gameEndTimerActive)
    {
        gameEndTimer += 16; // Mỗi tick ~16ms

        if (gameEndTimer >= GAME_END_DELAY_MS)
        {
            resetToMainMenu();
        }
    }

    GameScreenViewBase::handleTickEvent();
}

// ==================== UTILITY FUNCTIONS ====================

int GameScreenView::generateRandomNumber(int min, int max)
{
    // Simple linear congruential generator
    randomSeed = (randomSeed * 1103515245 + 12345) & 0x7fffffff;
    return min + (randomSeed % (max - min + 1));
}

int GameScreenView::calculateDamage(int baseDamage, bool isDefending)
{
    if (isDefending) {
        // Giảm 60% damage khi đang defend
        return baseDamage * 40 / 100;
    }
    return baseDamage;
}

bool GameScreenView::canUseSpecial(bool isPlayer)
{
    if (isPlayer) {
        // Player cần: đủ chakra (45+) và không trong cooldown
        return (playerChakraLevel >= 45 && !playerSpecialUsed);
    } else {
        // AI cần: đủ chakra (45+) và không trong cooldown
        return (aiChakraLevel >= 45 && !aiSpecialUsed);
    }
}

// ==================== PLAYER COMBAT FUNCTIONS ====================

void GameScreenView::playerAttack()
{
    // Reset về trạng thái bình thường trước
    resetNarutoState();

    // Hiển thị animation tấn công
    naruto.setVisible(false);
    naruto_atk.setVisible(true);
    naruto_atk.invalidate();
    naruto.invalidate();

    // Tính damage (15-25 random) - Giảm damage
    int baseDamage = generateRandomNumber(15, 25);
    int actualDamage = calculateDamage(baseDamage, aiDefending);

    // Gây damage lên AI
    aiHP -= actualDamage;
    if (aiHP < 0) aiHP = 0;

    // Player gain chakra sau attack (giảm từ 15 → 10)
    playerChakraLevel += 10;
    if (playerChakraLevel > 100) playerChakraLevel = 100;

    // Cập nhật UI
    updateAIHPDisplay();
    updatePlayerChakraDisplay();
    toggleLED();

    // Bắt đầu timer reset
    startResetTimer();
}

void GameScreenView::playerDefend()
{
    // Reset về trạng thái bình thường trước
    resetNarutoState();

    // Hiển thị animation phòng thủ
    naruto.setVisible(false);
    naruto_def.setVisible(true);
    naruto_def.invalidate();
    naruto.invalidate();

    // Set trạng thái defend
    playerDefending = true;

    // Hồi máu +10
    playerHP += 10;
    if (playerHP > 100) playerHP = 100;

    // Gain chakra +20
    playerChakraLevel += 20;
    if (playerChakraLevel > 100) playerChakraLevel = 100;

    // Cập nhật UI
    updatePlayerHPDisplay();
    updatePlayerChakraDisplay();
    toggleLED();

    // Bắt đầu timer reset
    startResetTimer();
}

void GameScreenView::playerSpecial()
{
    // Reset về trạng thái bình thường trước
    resetNarutoState();

    // Hiển thị animation special
    naruto.setVisible(false);
    naruto_spe.setVisible(true);
    naruto_spe.invalidate();
    naruto.invalidate();

    // Tính damage special (30-45 random) - Điều chỉnh để cân bằng
    int baseDamage = generateRandomNumber(30, 45);
    int actualDamage = calculateDamage(baseDamage, aiDefending);

    // Gây damage lên AI
    aiHP -= actualDamage;
    if (aiHP < 0) aiHP = 0;

    // Tiêu hao chakra (45 chakra)
    playerChakraLevel -= 45;
    if (playerChakraLevel < 0) playerChakraLevel = 0;

    // Set cooldown
    playerSpecialUsed = true;

    // Cập nhật UI
    updateAIHPDisplay();
    updatePlayerChakraDisplay();
    toggleLED();

    // Bắt đầu timer reset
    startResetTimer();
}

// ==================== AI COMBAT FUNCTIONS ====================

void GameScreenView::performAIAction()
{
    int action = 1; // Default: attack

    // AI thông minh hơn - phân tích tình huống trước khi quyết định
    int playerHPPercent = (playerHP * 100) / 100;
    int aiHPPercent = (aiHP * 100) / 100;
    int playerChakraPercent = (playerChakraLevel * 100) / 100;
    int aiChakraPercent = (aiChakraLevel * 100) / 100;

    // AI Decision making dựa trên personality và tình huống
    switch(aiPersonality)
    {
        case 0: // Aggressive AI (70%) - Thông minh hơn
            if (canUseSpecial(false)) {
                // Ưu tiên special khi player HP thấp hoặc AI chakra đầy
                if (playerHP <= 40 || aiChakraLevel >= 80) {
                    action = 3; // Special attack priority
                } else if (generateRandomNumber(1, 100) <= 45) {
                    action = 3; // 45% chance special
                } else {
                    action = 1; // Attack
                }
            } else if (aiHP <= 30 && generateRandomNumber(1, 100) <= 50) {
                action = 2; // Defend khi HP rất thấp
            } else if (playerChakraLevel >= 40 && aiHP <= 50 && generateRandomNumber(1, 100) <= 40) {
                action = 2; // Defend khi player sắp có special và AI yếu
            } else {
                action = 1; // Attack
            }
            break;

        case 1: // Defensive AI (20%) - Chiến thuật hơn
            if (aiHP <= 60 && generateRandomNumber(1, 100) <= 80) {
                action = 2; // Defend khi HP < 60%
            } else if (canUseSpecial(false) && playerHP <= 35) {
                action = 3; // Finishing move khi player yếu
            } else if (canUseSpecial(false) && aiHP <= 25) {
                action = 3; // Desperate special attack
            } else if (playerChakraLevel >= 40 && generateRandomNumber(1, 100) <= 70) {
                action = 2; // Defend khi player sắp có special
            } else if (aiChakraLevel < 30 && generateRandomNumber(1, 100) <= 60) {
                action = 2; // Defend để tích chakra
            } else if (generateRandomNumber(1, 100) <= 35) {
                action = 2; // 35% chance defend
            } else {
                action = 1; // Attack
            }
            break;

        case 2: // Random AI (10%) - Vẫn có logic
            if (canUseSpecial(false) && generateRandomNumber(1, 100) <= 40) {
                action = 3; // 40% special if possible
            } else if (aiHP <= 25 && generateRandomNumber(1, 100) <= 60) {
                action = 2; // Defend when critical
            } else {
                action = generateRandomNumber(1, 2); // Random attack/defend
            }
            break;
    }

    // Thực hiện hành động
    switch(action)
    {
        case 1:
            aiAttack();
            break;
        case 2:
            aiDefend();
            break;
        case 3:
            aiSpecial();
            break;
    }
}

void GameScreenView::aiAttack()
{
    // Reset về trạng thái bình thường trước
    resetBleachState();

    // Hiển thị animation tấn công
    bleach.setVisible(false);
    bleach_atk.setVisible(true);
    bleach_atk.invalidate();
    bleach.invalidate();

    // Tính damage (15-25 random) - Cân bằng với player
    int baseDamage = generateRandomNumber(15, 25);
    int actualDamage = calculateDamage(baseDamage, playerDefending);

    // Gây damage lên player
    playerHP -= actualDamage;
    if (playerHP < 0) playerHP = 0;

    // AI gain chakra sau attack (giảm từ 15 → 10)
    aiChakraLevel += 10;
    if (aiChakraLevel > 100) aiChakraLevel = 100;

    // Cập nhật UI
    updatePlayerHPDisplay();
    updateAIChakraDisplay();
}

void GameScreenView::aiDefend()
{
    // Reset về trạng thái bình thường trước
    resetBleachState();

    // Hiển thị animation phòng thủ
    bleach.setVisible(false);
    bleach_def.setVisible(true);
    bleach_def.invalidate();
    bleach.invalidate();

    // Set trạng thái defend
    aiDefending = true;

    // Hồi máu +10
    aiHP += 10;
    if (aiHP > 100) aiHP = 100;

    // Gain chakra +20
    aiChakraLevel += 20;
    if (aiChakraLevel > 100) aiChakraLevel = 100;

    // Cập nhật UI
    updateAIHPDisplay();
    updateAIChakraDisplay();
}

void GameScreenView::aiSpecial()
{
    // Reset về trạng thái bình thường trước
    resetBleachState();

    // Hiển thị animation special
    bleach.setVisible(false);
    bleach_spe.setVisible(true);
    bleach_spe.invalidate();
    bleach.invalidate();

    // Tính damage special (30-45 random) - Cân bằng với player
    int baseDamage = generateRandomNumber(30, 45);
    int actualDamage = calculateDamage(baseDamage, playerDefending);

    // Gây damage lên player
    playerHP -= actualDamage;
    if (playerHP < 0) playerHP = 0;

    // Tiêu hao chakra (45 chakra)
    aiChakraLevel -= 45;
    if (aiChakraLevel < 0) aiChakraLevel = 0;

    // Set cooldown
    aiSpecialUsed = true;

    // Cập nhật UI
    updatePlayerHPDisplay();
    updateAIChakraDisplay();
}

// ==================== CHARACTER STATE FUNCTIONS ====================

void GameScreenView::resetNarutoState()
{
    // Ẩn tất cả các trạng thái đặc biệt của naruto
    naruto_atk.setVisible(false);
    naruto_def.setVisible(false);
    naruto_spe.setVisible(false);

    // Hiển thị lại naruto bình thường
    naruto.setVisible(true);

    // Invalidate tất cả
    naruto_atk.invalidate();
    naruto_def.invalidate();
    naruto_spe.invalidate();
    naruto.invalidate();
}

void GameScreenView::resetBleachState()
{
    // Ẩn tất cả các trạng thái đặc biệt của bleach
    bleach_atk.setVisible(false);
    bleach_def.setVisible(false);
    bleach_spe.setVisible(false);

    // Hiển thị lại bleach bình thường
    bleach.setVisible(true);

    // Invalidate tất cả
    bleach_atk.invalidate();
    bleach_def.invalidate();
    bleach_spe.invalidate();
    bleach.invalidate();
}

void GameScreenView::startResetTimer()
{
    resetTimer = 0;
    resetTimerActive = true;
}

// ==================== HP DISPLAY SYSTEM ====================

void GameScreenView::updatePlayerHPDisplay()
{
    // Ẩn tất cả HP widgets của player trước
    hideAllPlayerHPWidgets();

    // Làm tròn xuống bội số 10
    int roundedHP = (playerHP / 10) * 10;

    // Hiển thị widget HP phù hợp cho player
    switch (roundedHP) {
        case 100:
            BITMAP_HP_100_ID.setVisible(true);
            BITMAP_HP_100_ID.invalidate();
            break;
        case 90:
            BITMAP_HP_90_ID.setVisible(true);
            BITMAP_HP_90_ID.invalidate();
            break;
        case 80:
            BITMAP_HP_80_ID.setVisible(true);
            BITMAP_HP_80_ID.invalidate();
            break;
        case 70:
            BITMAP_HP_70_ID.setVisible(true);
            BITMAP_HP_70_ID.invalidate();
            break;
        case 60:
            BITMAP_HP_60_ID.setVisible(true);
            BITMAP_HP_60_ID.invalidate();
            break;
        case 50:
            BITMAP_HP_50_ID.setVisible(true);
            BITMAP_HP_50_ID.invalidate();
            break;
        case 40:
            BITMAP_HP_40_ID.setVisible(true);
            BITMAP_HP_40_ID.invalidate();
            break;
        case 30:
            BITMAP_HP_30_ID.setVisible(true);
            BITMAP_HP_30_ID.invalidate();
            break;
        case 20:
            BITMAP_HP_20_ID.setVisible(true);
            BITMAP_HP_20_ID.invalidate();
            break;
        case 10:
            BITMAP_HP_10_ID.setVisible(true);
            BITMAP_HP_10_ID.invalidate();
            break;
        case 0:
            BITMAP_HP_0_ID.setVisible(true);
            BITMAP_HP_0_ID.invalidate();
            break;
        default:
            BITMAP_HP_100_ID.setVisible(true);
            BITMAP_HP_100_ID.invalidate();
            break;
    }
}

void GameScreenView::updateAIHPDisplay()
{
    // Ẩn tất cả HP widgets của AI trước
    hideAllAIHPWidgets();

    // Làm tròn xuống bội số 10
    int roundedHP = (aiHP / 10) * 10;

    // Hiển thị widget HP phù hợp cho AI (sử dụng các widget có _1)
    switch (roundedHP) {
        case 100:
            BITMAP_HP_100_ID_1.setVisible(true);
            BITMAP_HP_100_ID_1.invalidate();
            break;
        case 90:
            BITMAP_HP_90_ID_1.setVisible(true);
            BITMAP_HP_90_ID_1.invalidate();
            break;
        case 80:
            BITMAP_HP_80_ID_1.setVisible(true);
            BITMAP_HP_80_ID_1.invalidate();
            break;
        case 70:
            BITMAP_HP_70_ID_1.setVisible(true);
            BITMAP_HP_70_ID_1.invalidate();
            break;
        case 60:
            BITMAP_HP_60_ID_1.setVisible(true);
            BITMAP_HP_60_ID_1.invalidate();
            break;
        case 50:
            BITMAP_HP_50_ID_1.setVisible(true);
            BITMAP_HP_50_ID_1.invalidate();
            break;
        case 40:
            BITMAP_HP_40_ID_1.setVisible(true);
            BITMAP_HP_40_ID_1.invalidate();
            break;
        case 30:
            BITMAP_HP_30_ID_1.setVisible(true);
            BITMAP_HP_30_ID_1.invalidate();
            break;
        case 20:
            BITMAP_HP_20_ID_1.setVisible(true);
            BITMAP_HP_20_ID_1.invalidate();
            break;
        case 10:
            BITMAP_HP_10_ID_1.setVisible(true);
            BITMAP_HP_10_ID_1.invalidate();
            break;
        case 0:
            BITMAP_HP_0_ID_1.setVisible(true);
            BITMAP_HP_0_ID_1.invalidate();
            break;
        default:
            BITMAP_HP_100_ID_1.setVisible(true);
            BITMAP_HP_100_ID_1.invalidate();
            break;
    }
}

void GameScreenView::hideAllPlayerHPWidgets()
{
    // Ẩn tất cả HP widgets của player
    BITMAP_HP_100_ID.setVisible(false);
    BITMAP_HP_90_ID.setVisible(false);
    BITMAP_HP_80_ID.setVisible(false);
    BITMAP_HP_70_ID.setVisible(false);
    BITMAP_HP_60_ID.setVisible(false);
    BITMAP_HP_50_ID.setVisible(false);
    BITMAP_HP_40_ID.setVisible(false);
    BITMAP_HP_30_ID.setVisible(false);
    BITMAP_HP_20_ID.setVisible(false);
    BITMAP_HP_10_ID.setVisible(false);
    BITMAP_HP_0_ID.setVisible(false);

    // Invalidate tất cả
    BITMAP_HP_100_ID.invalidate();
    BITMAP_HP_90_ID.invalidate();
    BITMAP_HP_80_ID.invalidate();
    BITMAP_HP_70_ID.invalidate();
    BITMAP_HP_60_ID.invalidate();
    BITMAP_HP_50_ID.invalidate();
    BITMAP_HP_40_ID.invalidate();
    BITMAP_HP_30_ID.invalidate();
    BITMAP_HP_20_ID.invalidate();
    BITMAP_HP_10_ID.invalidate();
    BITMAP_HP_0_ID.invalidate();
}

void GameScreenView::hideAllAIHPWidgets()
{
    // Ẩn tất cả HP widgets của AI
    BITMAP_HP_100_ID_1.setVisible(false);
    BITMAP_HP_90_ID_1.setVisible(false);
    BITMAP_HP_80_ID_1.setVisible(false);
    BITMAP_HP_70_ID_1.setVisible(false);
    BITMAP_HP_60_ID_1.setVisible(false);
    BITMAP_HP_50_ID_1.setVisible(false);
    BITMAP_HP_40_ID_1.setVisible(false);
    BITMAP_HP_30_ID_1.setVisible(false);
    BITMAP_HP_20_ID_1.setVisible(false);
    BITMAP_HP_10_ID_1.setVisible(false);
    BITMAP_HP_0_ID_1.setVisible(false);

    // Invalidate tất cả
    BITMAP_HP_100_ID_1.invalidate();
    BITMAP_HP_90_ID_1.invalidate();
    BITMAP_HP_80_ID_1.invalidate();
    BITMAP_HP_70_ID_1.invalidate();
    BITMAP_HP_60_ID_1.invalidate();
    BITMAP_HP_50_ID_1.invalidate();
    BITMAP_HP_40_ID_1.invalidate();
    BITMAP_HP_30_ID_1.invalidate();
    BITMAP_HP_20_ID_1.invalidate();
    BITMAP_HP_10_ID_1.invalidate();
    BITMAP_HP_0_ID_1.invalidate();
}

// ==================== CHAKRA SYSTEM ====================

void GameScreenView::updatePlayerChakraDisplay()
{
    // Tính toán width dựa trên chakra level (0-100%)
    int maxWidth = 86; // Width tối đa của thanh chakra player
    int currentWidth = (playerChakraLevel * maxWidth) / 100;

    // Cập nhật kích thước Box chakra của player
    chakra_box1.setPosition(14, 43, currentWidth, 5);
    chakra_box1.invalidate();
}

void GameScreenView::updateAIChakraDisplay()
{
    // Tính toán width dựa trên AI chakra level (0-100%)
    int maxWidth = 86; // Width tối đa của thanh chakra AI
    int currentWidth = (aiChakraLevel * maxWidth) / 100;

    // Debug: Đảm bảo currentWidth không âm
    if (currentWidth < 0) currentWidth = 0;
    if (currentWidth > maxWidth) currentWidth = maxWidth;

    // Cập nhật kích thước Box chakra của AI
    chakra_box2.setPosition(135, 43, currentWidth, 5);
    chakra_box2.invalidate();
}

void GameScreenView::gainChakra(int amount)
{
    playerChakraLevel += amount;
    if (playerChakraLevel > 100)
    {
        playerChakraLevel = 100;
    }

    updatePlayerChakraDisplay();
}

void GameScreenView::useChakra(int amount)
{
    playerChakraLevel -= amount;
    if (playerChakraLevel < 0)
    {
        playerChakraLevel = 0;
    }

    updatePlayerChakraDisplay();
}

// ==================== GAME END SYSTEM ====================

void GameScreenView::checkGameEnd()
{
    if (gameEnded) return; // Đã kết thúc rồi thì không check nữa

    if (playerHP <= 0) {
        endGame(false); // Player thua
    } else if (aiHP <= 0) {
        endGame(true);  // Player thắng
    }
}

void GameScreenView::endGame(bool playerWon)
{
    gameEnded = true;

    // Ẩn menu actions
    hideActionButtons();

    // Reset tất cả animations về trạng thái bình thường
    resetNarutoState();
    resetBleachState();

    // Visual feedback cho kết quả
    if (playerWon) {
        // Player thắng - LED nhấp nháy nhanh
        for (int i = 0; i < 6; i++) {
            toggleLED();
        }
    } else {
        // Player thua - LED sáng liên tục
        HAL_GPIO_WritePin(GPIOG, GPIO_PIN_13, GPIO_PIN_SET);
    }

    // Bắt đầu timer delay về main menu
    gameEndTimer = 0;
    gameEndTimerActive = true;
}

void GameScreenView::resetToMainMenu()
{
    // Tắt LED
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_13, GPIO_PIN_RESET);

    // Reset tất cả trạng thái về ban đầu
    playerHP = 100;
    aiHP = 100;
    playerChakraLevel = 0;
    aiChakraLevel = 0;
    menuOpen = false;
    gameEnded = false;

    playerDefending = false;
    aiDefending = false;
    playerSpecialUsed = false;
    aiSpecialUsed = false;

    resetTimerActive = false;
    gameEndTimerActive = false;
    resetTimer = 0;
    gameEndTimer = 0;

    // Cập nhật UI về trạng thái ban đầu
    updatePlayerHPDisplay();
    updateAIHPDisplay();
    updatePlayerChakraDisplay();
    updateAIChakraDisplay();

    resetNarutoState();
    resetBleachState();
    hideActionButtons();

    // Khởi tạo lại AI personality mới
    int personalityRoll = generateRandomNumber(1, 100);
    if (personalityRoll <= 70) {
        aiPersonality = 0; // Aggressive
    } else if (personalityRoll <= 90) {
        aiPersonality = 1; // Defensive
    } else {
        aiPersonality = 2; // Random
    }

    // Có thể thêm transition về main menu screen nếu có
    // application().gotoMainMenuScreen();
}
