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
    raise Exception("Did I log in here?")
else:
    print("Invalid user and pass, this is right")

elem = getElement(driver, "//input[@id='username']")
elem.clear()
elem.send_keys("aheuser")
elem = getElement(driver, "//input[@id='password']")
elem.clear()
elem.send_keys("AHeuser10!")
elem.send_keys(Keys.RETURN)
try:
    WebDriverWait(driver, 10).until(EC.url_contains("mainmenu"))
except WebDriverException:
    raise Exception("Didn't log in, but should've")
else:
    print("Logged in")

driver.close()