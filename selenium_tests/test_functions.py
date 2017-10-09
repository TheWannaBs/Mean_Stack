# this file holds some common testing functions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

depurl = "localhost:3000"

def getElement(driver, xpath):
    return WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, xpath)))

def login(driver, username, password):
    driver.get(depurl)
    elem = getElement(driver, "//input[@id='username']")
    elem.clear()
    elem.send_keys(username)
    elem = getElement(driver, "//input[@id='password']")
    elem.clear()
    elem.send_keys(password)
    elem.send_keys(Keys.RETURN)

def logout(driver):
    elem = getElement(driver, "//a[text()='Logout']")
    elem.click()