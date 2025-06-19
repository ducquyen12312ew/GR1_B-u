#include <gui/mainmenuscreen_screen/MainMenuScreenView.hpp>

MainMenuScreenView::MainMenuScreenView()
{
}

void MainMenuScreenView::setupScreen()
{
    MainMenuScreenViewBase::setupScreen();
}

void MainMenuScreenView::tearDownScreen()
{
    MainMenuScreenViewBase::tearDownScreen();
}

// THÊM LẠI FUNCTION NÀY (có thể để trống):
void MainMenuScreenView::handleClickEvent(const ClickEvent& evt)
{
    // Gọi parent handler (TouchGFX sẽ handle button)
    MainMenuScreenViewBase::handleClickEvent(evt);
}
