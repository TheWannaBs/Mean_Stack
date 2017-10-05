# this file holds some common testing functions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def getElement(driver, xpath):
    return WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, xpath)))