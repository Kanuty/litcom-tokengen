import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(1000)

    # Click on "⚔️ GROUP TRACKER" tab
    page.get_by_role("button", name="⚔️ GROUP TRACKER").click()
    page.wait_for_timeout(1000)

    # Enable NATO Symbol
    page.locator("text=Show NATO Symbol in Header").click()
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path="/home/jules/verification/screenshots/tactical_group_tracker_v3.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
