#ifndef GAMESCREEN_VIEW_HPP
#define GAMESCREEN_VIEW_HPP

#include <gui_generated/gamescreen_screen/GameScreenViewBase.hpp>
#include <gui/gamescreen_screen/GameScreenPresenter.hpp>

class GameScreenView : public GameScreenViewBase
{
public:
GameScreenView();
virtual ~GameScreenView() {}
virtual void setupScreen();
virtual void tearDownScreen();

virtual void handleClickEvent(const ClickEvent& evt);
virtual void handleDragEvent(const DragEvent& evt);
virtual void handleTickEvent();

// Menu functions
void hideActionButtons();
void showActionButtons();
void toggleActionMenu();

// Combat functions
void playerAttack();
void playerDefend();
void playerSpecial();

// AI functions
void performAIAction();
void aiAttack();
void aiDefend();
void aiSpecial();
int calculateDamage(int baseDamage, bool isDefending);
bool canUseSpecial(bool isPlayer);

// HP display functions
void updatePlayerHPDisplay();
void updateAIHPDisplay();
void hideAllPlayerHPWidgets();
void hideAllAIHPWidgets();

// Chakra system functions
void updatePlayerChakraDisplay();
void updateAIChakraDisplay();

// Character state functions
void resetNarutoState();
void resetBleachState();
void startResetTimer();

// Game end functions
void checkGameEnd();
void endGame(bool playerWon);
void resetToMainMenu();

// Utility functions
int generateRandomNumber(int min, int max);
void gainChakra(int amount);
void useChakra(int amount);

// GPIO functions
void initGPIO();
void toggleLED();

protected:
// Game state
int playerHP;
int aiHP;
bool menuOpen;
bool gameEnded; // Trạng thái kết thúc game

// Chakra system
int playerChakraLevel; // 0-100
int aiChakraLevel; // 0-100 (cho AI)

// Combat state
bool playerDefending;
bool aiDefending;
bool playerSpecialUsed; // Cooldown cho special
bool aiSpecialUsed;

// AI personality (0=Aggressive, 1=Defensive, 2=Random)
int aiPersonality;

// Timer for auto reset and game end
int resetTimer;
bool resetTimerActive;
int gameEndTimer; // Timer để delay trước khi về main menu
bool gameEndTimerActive;
static const int RESET_TIME_MS = 1000; // 1 second
static const int GAME_END_DELAY_MS = 3000; // 3 seconds delay before returning to menu

// Random seed
uint32_t randomSeed;
};

#endif // GAMESCREEN_VIEW_HPP
