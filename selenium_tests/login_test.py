from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from test_functions import *
from selenium.common.exceptions import *

driver = webdriver.Firefox()
driver.get("http://localhost:3000")
elem = getElement(driver, "//input[@id='username']")
elem.clear()
elem.send_keys("test")
elem = getElement(driver, "//input[@id='password']")
elem.clear()
elem.send_keys("test")
elem.send_keys(Keys.RETURN)
try:
    elem = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[text()='Invalid username or password']")))
except WebDriverException:
    print("Something went wrong here")
    assert False
else:
    print("This is right")

elem = getElement(driver, "//input[@id='username']")
elem.clear()
elem.send_keys("aheuser")
elem = getElement(driver, "//input[@id='password']")
elem.clear()
elem.send_keys("AHeuser10!")
elem.send_keys(Keys.RETURN)
assert("mainmenu" in driver.current_url)