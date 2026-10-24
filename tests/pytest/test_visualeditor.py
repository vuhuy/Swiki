import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from tests.utils.helpers import assert_js_errors, assert_php_errors, save_screenshot, wait_for_visualeditor


field_params = pytest.mark.parametrize(
    "name,click_selector,input_selector,value",
    [
        (
            "Spec",
            ".ve-ui-mwAceEditorWidget",
            ".ace_text-input",
            '{"openapi":"3.0.0","info":{"title":"Swiki","version":"1.0.0"},"paths":{"/swiki":{"get":{"responses":{"200":{"description":"Swiki","content":{"text/plain":{"schema":{"type":"string"}}}}}}}}}',
        ),
        (
            "Url",
            ".oo-ui-window.oo-ui-dialog .oo-ui-labelElement:nth-of-type(2) .oo-ui-inputWidget-input",
            "",
            "/extensions/Swiki/tests/data/openapi.json",
        ),
        (
            "Urls",
            ".oo-ui-window.oo-ui-dialog .oo-ui-labelElement:nth-of-type(3) .oo-ui-inputWidget-input",
            "",
            "/extensions/Swiki/tests/data/openapi.json|Petstore 3|/extensions/Swiki/tests/data/swagger.json|Petstore 2",
        ),
    ],
)

@pytest.mark.dependency(name="visualeditor_control_test")
def test_visualeditor_control(browser, base_url):
    """Javascript control test without using the extension."""

    browser.get(f"{base_url}/index.php?title=Control&veaction=edit")
    assert_php_errors(browser)
    WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".oo-ui-toolbar")))
    assert_js_errors(browser)

@field_params
@pytest.mark.dependency(depends=["visualeditor_control_test"])
def test_visualeditor_edit(browser, base_url, name, click_selector, input_selector, value):
    """Test editing an existing Swiki node with VisualEditor."""

    browser.get(f"{base_url}/index.php?title=VisualEditor_Edit&veaction=edit")
    input_selector = click_selector if input_selector == "" else input_selector

    try:
        assert_php_errors(browser)
        wait_for_visualeditor(browser)

        # Use node to open Swiki dialog.
        element = WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".ve-ce-branchNode .mw-ext-swiki-container")))
        ActionChains(browser).move_to_element(element).click().perform()
        save_screenshot(browser, f'VisualEditor-Edit-{name}-Context')
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".oo-ui-widget:nth-child(1) > .oo-ui-buttonElement-button > .oo-ui-labelElement-label"))).click()

        # Edit Swiki tag with valid JSON and save.
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, click_selector))).click()
        browser.find_element(By.CSS_SELECTOR, input_selector).send_keys(value)
        save_screenshot(browser, f'VisualEditor-Edit-{name}-Dialog')
        browser.find_element(By.CSS_SELECTOR, ".oo-ui-flaggedElement-primary:nth-child(1) .oo-ui-labelElement-label").click()

        # Expect hook parser says Swagger UI should render this tag.
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".mw-ext-swiki-render")))
        save_screenshot(browser, f'VisualEditor-Edit-{name}-Node')

    except Exception as e:
        save_screenshot(browser, f'VisualEditor-Edit-{name}-Fail')
        raise

@field_params
@pytest.mark.dependency(depends=["visualeditor_control_test"])
def test_visualeditor_insert(browser, base_url, name, click_selector, input_selector, value):
    """Test inserting an new Swiki node with VisualEditor."""

    browser.get(f"{base_url}/index.php?title=VisualEditor_Insert&veaction=edit")
    input_selector = click_selector if input_selector == "" else input_selector

    try:
        assert_php_errors(browser)
        wait_for_visualeditor(browser)

        # Use toolbar to open Swiki dialog.
        element = browser.find_element(By.CSS_SELECTOR, ".ve-ui-toolbar-group-insert")
        ActionChains(browser).move_to_element(element).click().perform()
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".oo-ui-popupToolGroup-active-tools .oo-ui-tool-name-more-fewer .oo-ui-tool-title"))).click()
        save_screenshot(browser, f'VisualEditor-Insert-{name}-Tool')
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".oo-ui-tool-name-swiki .oo-ui-tool-title"))).click()

        # Insert Swiki tag with value and save.
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, click_selector))).click()
        browser.find_element(By.CSS_SELECTOR, input_selector).send_keys(value)
        save_screenshot(browser, f'VisualEditor-Insert-{name}-Dialog')
        browser.find_element(By.CSS_SELECTOR, ".oo-ui-flaggedElement-primary:nth-child(1) .oo-ui-labelElement-label").click()

        # Expect hook parser says Swagger UI should render this tag.
        WebDriverWait(browser, 5).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".mw-ext-swiki-render")))
        save_screenshot(browser, f'VisualEditor-Insert-{name}-Render')

    except Exception as e:
        save_screenshot(browser, f'VisualEditor-Insert-{name}-Fail')
        raise
