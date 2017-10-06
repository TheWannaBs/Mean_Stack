from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from test_functions import *
from selenium.common.exceptions import *

driver = webdriver.Firefox()
login("test", "test")
try:
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[text()='Invalid username or password']")))
except WebDriverException:
    raise Exception("Did I log in here?")
else:
    print("Invalid user and pass, this is right")

login("aheuser", "AHeuser10!")
try:
    WebDriverWait(driver, 10).until(EC.url_contains("mainmenu"))
except WebDriverException:
    raise Exception("Didn't log in, but should've")
else:
    print("Logged in")

logout(driver)

driver.close()