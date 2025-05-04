from selenium import webdriver
import time


def assert_js_errors(browser):
    """Assert that there are no javascript errors on the current page."""

    # Todo: This is a Chrome thingy. Firefox needs DevTools.
    if isinstance(browser, webdriver.Chrome):
        time.sleep(2)
        logs = browser.get_log("browser")
        errors = [log for log in logs if log["level"] == "SEVERE"]
        assert len(errors) == 0, f"Javascript errors detected: {errors}."

def save_screenshot(browser, name):
    """Save a screenshot of the current page."""

    if isinstance(browser, webdriver.Chrome):
        browser.save_screenshot(f'tests/screenshots/Chrome-{name}.png')
    elif isinstance(browser, webdriver.Firefox):
        browser.save_screenshot(f'tests/screenshots/Firefox-{name}.png')
    else:
        browser.save_screenshot(f'tests/screenshots/Browser-{name}.png')
