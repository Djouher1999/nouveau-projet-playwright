import { expect, test } from '@playwright/test'



test("US-01: Connexion @valide", async ({ page }) => {
    // Visiter la 1ère page ...
    await page.goto("https://api.efi-academy.com/e-commerce-test-api/auth/login.php")

    // Email 
    await page.locator("#login-email").fill("client@boutique.qa")
    await page.locator("#login-password").fill("Client123!")

    await page.getByRole("button", { name: "Se connecter" }).click()
    await expect(page).toHaveURL(/client\/shop.php/)

    let elements = await page.getByTestId("shop-grid").locator("[data-testId^='product-card-']").count()

    //console.log(elements)
    let p1 = await fn(page, elements)
    let p2 = await fn(page, elements)

    while (p1.index == p2.index)
        p2 = await fn(page, elements)

    console.log(p1)
    console.log(p2)

    await page.getByTestId("add-to-cart-qty-" + p1.index).fill(p1.qte.toString())
    await page.getByTestId("add-to-cart-qty-" + p2.index).fill(p2.qte.toString())
    await page.getByTestId("add-to-cart-btn-" + p1.index).click()
    await page.getByTestId("add-to-cart-btn-" + p2.index).click()

    expect(await page.locator("#nav-cart-badge")).toHaveText((p1.qte + p2.qte).toString())
})

let fn = async (page, elements) => {
    let index = Math.floor(Math.random() * elements) + 1
    let qte1 = Math.floor(Math.random() * 9) + 1

    let prod1 = page.getByTestId("product-card-" + index)

    let qte_attend = Number(await prod1.getAttribute("data-stock"))

    while (Number(qte1) > qte_attend) {
        index = Math.floor(Math.random() * elements) + 1

        qte1 = Math.floor(Math.random() * 9) + 1

        prod1 = page.getByTestId("product-card-" + index)

        qte_attend = Number(await prod1.getAttribute("data-stock"))

    }

    return { "qte": qte1, "index": index }
}

