import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from tests.utils.helpers import assert_js_errors, save_screenshot


@pytest.mark.dependency(name="hook_control_test")
def test_hook_control(browser, base_url):
    """Javascript control test without using the extension."""

    browser.get(f"{base_url}/index.php/Control")
    assert_js_errors(browser)

@pytest.mark.parametrize("page,should_be_valid,should_be_standalone", [
    ("Swiki_Invalid_Inline", False, False),
    ("Swiki_Invalid_Urls", False, False),
    ("Swiki_Valid_Inline", True, False),
    ("Swiki_Valid_Url_Standalone", True, True),
    ("Swiki_Valid_Url", True, False),
    ("Swiki_Valid_Urls", True, True)
])
@pytest.mark.dependency(depends=["hook_control_test"])
def test_hook_page(browser, base_url, page, should_be_valid, should_be_standalone):
    """Test Swiki hook and Swagger UI rendering result of the hook."""

    browser.get(f"{base_url}/index.php/{page}")

    try:
        if should_be_valid:
            # Expect hook parser says Swagger UI should render this tag.
            browser.find_element(By.CSS_SELECTOR, ".mw-ext-swiki-render")

            # Wait for Swagger UI rendered.
            shadow_host = WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".mw-ext-swiki-rendered")))
            shadow_root = shadow_host.shadow_root

            # Expect a rendered specification.
            shadow_root.find_element(By.CSS_SELECTOR, ".information-container")

            # Expect the correct render preset.
            elements = shadow_root.find_elements(By.CSS_SELECTOR, ".topbar")
            if should_be_standalone:
                assert len(elements) > 0, f"Expected standalone preset, got default preset"
            else:
                assert len(elements) == 0, f"Expected default preset, got standalone preset"

        else:
            # Expect hook parser says Swagger UI should not render this tag.
            browser.find_element(By.CSS_SELECTOR, ".mw-ext-swiki-error")

        assert_js_errors(browser)
        save_screenshot(browser, f'Hook-{page}-Render')

    except Exception as e:
        save_screenshot(browser, f'Hook-{page}-Fail')
        raise
