# this file holds some common testing functions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

depurl = "http://k9partners.herokuapp.com/"
requirements = {"User is able to login": "Untested",
                "User sees appropriate main menu": "Untested",
                "Admin sees appropriate main menu": "Untested",
                "Admin can view client list": "Untested",
                "Admin can add a new client": "Untested",
                "Admin can view the new client": "Untested",
                "Admin can edit the new client": "Untested",
                "Admin can delete the new client": "Untested",
                "Admin can view inventory list": "Untested",
                "Admin can add a new item": "Untested",
                "Admin can view the new item": "Untested",
                "Admin can edit the new item": "Untested",
                "Admin can delete the new item": "Untested",
                "Admin can view user list": "Untested",
                "Admin can add a new user": "Untested",
                "Admin can view the new user": "Untested",
                "Admin can edit the new user": "Untested",
                "Admin can delete the new user": "Untested",
                "Admin can receive items": "Untested",
                "Admin can move items": "Untested"}


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


def setReq(req, passed):
    if(passed):
        requirements[req] = "Passed"
    elif(requirements[req] != "Passed"):
        requirements[req] = "Failed"


def printReq(tests):
    failures = 0
    untested = 0
    print("Requirement\t\tStatus")
    for req in requirements:
        print(req + "\t" + requirements[req])
        if(requirements[req] == "Failed"):
            failures += 1
        elif(requirements[req] == "Untested"):
            untested += 1
    print(str(tests) + " test, " + str(len(requirements)) + " assertions, " +
          str(failures) + " failures, " + str(untested) + " untested")
