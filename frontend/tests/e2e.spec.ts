import { test, expect, Page } from '@playwright/test';

// Define a placeholder user for the test
const TEST_USER_EMAIL = `testuser-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123';
const PRODUCT_NAME = 'Basketball'; // A product assumed to exist in the product catalog

const REGISTER_URL = '/auth/register';
const LOGIN_URL = '/auth/login';

// helper function to register a new user
async function registerUser(page: Page) {
    await page.goto(REGISTER_URL);
    await expect(page.locator('h1:has-text("Sign Up")')).toBeVisible();

    await page.locator('#emailInput').fill(TEST_USER_EMAIL);
    await page.locator('#passwordInput').fill(TEST_PASSWORD);
    await page.locator('#confirmPasswordInput').fill(TEST_PASSWORD);

    await page.getByRole('button', { name: 'Register' }).click();

    // After successful registration, the app should navigate to the dashboard page
    await expect(page).toHaveURL(/.*\/dashboard/);

    // verify that key dashboard elements are visible
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
}

// helper function to logout
async function logout(page: Page) {
    await page.locator('#logoutButton').click();
    // After logout, the login button should be visible again
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
}


test.describe('Full User Journey E2E Test', () => {

    test('Successful Case: Should register, log in, add product to cart, and view cart', async ({ page }) => {

        // --- 1. REGISTRATION & INITIAL LOGIN ---
        await test.step('Register a new user and verify login', async () => {
            await registerUser(page);
        });

        // The user is now logged in. We log out to test the manual login flow later.
        await test.step('Logout immediately after registration', async () => {
            await logout(page);
        });

        // --- 2. LOGIN ---
        await test.step('Perform manual login with the registered user', async () => {
            await page.goto(LOGIN_URL);
            await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();

            await page.locator('#emailInput').fill(TEST_USER_EMAIL);
            await page.locator('#passwordInput').fill(TEST_PASSWORD);
            await page.getByRole('button', { name: 'Log in' }).click();

            // After successful login, the app should navigate to the dashboard page
            await expect(page).toHaveURL(/.*\/dashboard/);

            // Verify that key dashboard elements are visible
            await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
        });


        // --- 3. WATCH A PRODUCT ---
        await test.step('Watch some test product and verify the Add to Cart button', async () => {
            // Click the Products link to navigate
            await page.getByRole('link', { name: 'Products' }).click();

            // Locate the unique product card that contains the product name
            const productContainer = page.locator(`.product-card:has-text("${PRODUCT_NAME}")`);

            // Check that the product title itself is visible
            await expect(productContainer.locator(`h3:has-text("${PRODUCT_NAME}")`)).toBeVisible();

            // Check that the product add to cart button is visible
            const addToCartButton = productContainer.getByRole('button', { name: /Add to Cart/i });
            await expect(addToCartButton).toBeVisible();
        });

        // --- 4. ADD A PRODUCT TO CART ---
        await test.step('Add the test product to the cart and verify toast notification', async () => {
            // Locate the unique product card that contains the product name
            const productContainer = page.locator(`.product-card:has-text("${PRODUCT_NAME}")`);

            // Locate its add to cart button
            const addToCartButton = productContainer.getByRole('button', { name: /Add to Cart/i });

            // Click on add to cart
            await addToCartButton.click();

            // Expect that a successful messege will be visible
            const expectedMessage = `${PRODUCT_NAME} has been added to your cart.`;
            const uniqueToastMessage = page.getByText(expectedMessage, { exact: true });
            await expect(uniqueToastMessage).toBeVisible({ timeout: 10000 });
        });

        // --- 5. VIEW CART LIST ---
        await test.step('Navigate to the cart page anf verify the test item is there', async () => {
            // Click the Cart link to navigate
            await page.getByRole('link', { name: 'Cart' }).click();

            // Expect the added product name will be visible
            await expect(page.locator(`h4:has-text("${PRODUCT_NAME}")`)).toBeVisible();
        });

        // --- 6. FINAL LOGOUT ---
        await test.step('Final Logout', async () => {
            await logout(page);
        });
    });

    test('Fail Case 1: Should fail to register an existing user', async ({ page }) => {
        await test.step('Register the test user successfully first', async () => {
            await registerUser(page);

            // registration also logging in the user so logout is needed
            await logout(page);
        });

        // Set up a dialog listener
        let alertMessage = '';
        page.on('dialog', async (dialog) => {
            alertMessage = dialog.message();
            await dialog.dismiss();
        });

        await test.step('Attempt to register the existing test user', async () => {
            // Navigate to the register page
            await page.goto(REGISTER_URL);
            await expect(page.locator('h1:has-text("Sign Up")')).toBeVisible();

            // Fill the same test user data
            await page.locator('#emailInput').fill(TEST_USER_EMAIL);
            await page.locator('#passwordInput').fill(TEST_PASSWORD);
            await page.locator('#confirmPasswordInput').fill(TEST_PASSWORD);

            // Click the register button
            await page.getByRole('button', { name: 'Register' }).click();

            // Wait a moment for the event handler to capture the dialog
            await page.waitForTimeout(500);
        });

        await test.step('Verify the captured alert message and failure', async () => {
            // Check that the captured message matches the expected message from the component
            const EXPECTED_MESSAGE = 'A user with this email is already exists!';
            await expect(alertMessage).toBe(EXPECTED_MESSAGE);

            // Ensure the app did NOT navigate to the dashboard
            await expect(page).not.toHaveURL(/.*\/dashboard/);
        });
    });
});