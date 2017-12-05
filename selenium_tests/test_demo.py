from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from test_functions import *
from selenium.common.exceptions import *

def firstTest(driver, tests):
    tests += 1
    # first test: login functionality
    try:
        # login with invalid credentials
        login(driver, "test", "test")
        try:
            WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[text()='Invalid username or password']")))
        except WebDriverException:
            raise Exception("Did I log in here?")
        else:
            # invalid username and password, this is right
            pass
        # login with valid credentials
        login(driver, "aheuser", "AHeuser10!")
        try:
            WebDriverWait(driver, 10).until(EC.url_contains("mainmenu"))
        except WebDriverException:
            raise Exception("Didn't log in, but should've")
        else:
            print("Logged in")
        # check for user buttons
        try:
            getElement(driver, "//a[text()='Move Items']")
        except WebDriverException:
            raise Exception("Move button wasn't found")
        try:
            getElement(driver, "//a[text()='Client Management']")
            raise Exception("User has buttons that they shouldn't have")
        except WebDriverException:
            # this is correct
            pass
        try:
            getElement(driver, "//a[text()='Inventory Management']")
            raise Exception("User has buttons that they shouldn't have")
        except WebDriverException:
            # this is correct
            pass
        try:
            getElement(driver, "//a[text()='User Management']")
            raise Exception("User has buttons that they shouldn't have")
        except WebDriverException:
            # this is correct
            setReq("User sees appropriate main menu", True)
        # logout
        logout(driver)
        # check that we are logged out
        assert(WebDriverWait(driver, 10).until(EC.url_to_be(depurl)))
        setReq("User is able to login", True)
        # login as admin and check their buttons
        login(driver,"admin", "admin")
        try:
            getElement(driver, "//a[text()='Client Management']")
            getElement(driver, "//a[text()='Inventory Management']")
            getElement(driver, "//a[text()='User Management']")
            getElement(driver, "//a[text()='Move Items']")
            setReq("Admin sees appropriate main menu", True)
        except WebDriverException:
            raise Exception("One or more buttons weren't found")
        # logout
        logout(driver)
    except (Exception, AssertionError) as e:
        setReq("User is able to login", False)
        setReq("User sees appropriate main menu", False)
        setReq("Admin sees appropriate main menu", False)
        print(e)
    return tests

def secondTest(driver):
    # second test: inventory crud
    try:
        # login as admin
        login(driver, "admin", "admin")
    except (Exception, AssertionError) as e:
        # do something
        pass

def main():
    tests = 0
    # create the webdriver
    driver = webdriver.Firefox()
    # run the tests
    tests = firstTest(driver, tests)

    # close the webdriver
    driver.close()
    # print testing stats
    printReq(tests)

main()