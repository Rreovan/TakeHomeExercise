# Test Cases

Drives automation under `tests/ui` (SauceDemo) and `tests/api` (JSONPlaceholder). IDs map 1:1 to `test.step`/`test()` titles in the automation so results are traceable back to this document.

**Legend:** Priority — P1 (must-have/happy path), P2 (important edge case), P3 (nice-to-have). Type — Positive / Negative / Boundary.

> **Note on API negative testing:** JSONPlaceholder is a mock API — it does not persist data and does not perform real server-side validation. `POST`/`PUT`/`PATCH` return success (200/201) even for missing-field or malformed payloads, and there are no 400/422 responses. Negative "required field" API cases below therefore assert the **documented mock behavior** (echoes payload + assigns a fake id) rather than a rejection, and explicitly note this limitation in the test itself.

---

## UI Test Cases — SauceDemo (`tests/ui`)

Base URL: https://www.saucedemo.com — standard credentials: `standard_user` / `secret_sauce`; also uses `locked_out_user`, `secret_sauce` for all users.

### Login

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|
| UI-001 | Login with valid standard user | Positive | P1 | On login page | Enter `standard_user`/`secret_sauce`; click Login | Redirected to `/inventory.html`; product grid visible |
| UI-002 | Login with locked out user | Negative | P1 | On login page | Enter `locked_out_user`/`secret_sauce`; click Login | Stays on login page; error banner "Epic sadface: Sorry, this user has been locked out." |
| UI-003 | Login with invalid password | Negative | P1 | On login page | Enter `standard_user`/`wrong_pw`; click Login | Error "Username and password do not match any user in this service" |
| UI-004 | Login with empty username | Negative | P2 | On login page | Leave username blank, enter password; click Login | Error "Username is required" |
| UI-005 | Login with empty password | Negative | P2 | On login page | Enter username, leave password blank; click Login | Error "Password is required" |
| UI-006 | Login with both fields empty | Negative | P2 | On login page | Click Login with no input | Error "Username is required" |
| UI-007 | Username field upper-bound length | Boundary | P2 | On login page | Enter 500-character random string as username + valid password; click Login | No crash/hang; standard "do not match" error rendered; field does not visually break layout |
| UI-008 | Password field with special/script characters | Boundary | P3 | On login page | Enter `standard_user` + password `<script>alert(1)</script>' OR '1'='1`; click Login | Input treated as literal text; standard mismatch error shown; no script executes |

### Inventory & Sorting

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|
| UI-010 | Inventory lists all 6 products | Positive | P1 | Logged in as standard_user | Load inventory page | Exactly 6 `.inventory_item` cards rendered, each with name, price, image, Add to cart button |
| UI-011 | Sort Name (A to Z) | Positive | P1 | On inventory page | Select "Name (A to Z)" from sort dropdown | Product names rendered in ascending alphabetical order |
| UI-012 | Sort Name (Z to A) | Positive | P2 | On inventory page | Select "Name (Z to A)" | Product names rendered in descending alphabetical order |
| UI-013 | Sort Price (low to high) | Positive | P1 | On inventory page | Select "Price (low to high)" | Prices rendered ascending numerically |
| UI-014 | Sort Price (high to low) | Positive | P2 | On inventory page | Select "Price (high to low)" | Prices rendered descending numerically |
| UI-015 | Add single product to cart | Positive | P1 | On inventory page | Click "Add to cart" on one product | Button label changes to "Remove"; cart badge shows "1" |
| UI-016 | Add multiple products updates badge accurately | Positive | P1 | On inventory page | Add 3 distinct products to cart | Cart badge shows "3"; all 3 buttons show "Remove" |
| UI-017 | Remove product from inventory page | Positive | P2 | 1+ items in cart | Click "Remove" on an added product from inventory page | Badge count decrements by 1; button reverts to "Add to cart" |
| UI-018 | Add all then remove all clears badge | Boundary | P2 | On inventory page | Add all 6 products, then remove all 6 | Cart badge disappears entirely (no "0" badge shown) |

### Cart

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|
| UI-020 | Cart lists correct items | Positive | P1 | 2 items added | Navigate to cart | Cart page lists exactly the 2 added items with correct names/prices/qty=1 |
| UI-021 | Remove item from cart page | Positive | P2 | 1+ items in cart | Click "Remove" on an item in cart page | Item removed from list; badge count decrements |
| UI-022 | Continue Shopping returns to inventory | Positive | P3 | On cart page | Click "Continue Shopping" | Redirected to `/inventory.html` |
| UI-023 | Checkout navigates to step one | Positive | P1 | 1+ items in cart | Click "Checkout" on cart page | Redirected to `/checkout-step-one.html` |
| UI-024 | Checkout button with empty cart | Boundary | P2 | Cart is empty | Navigate to cart page with 0 items, click "Checkout" | Document actual behavior: app does not block empty-cart checkout (button remains enabled); navigates to step one |

### Checkout

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|
| UI-030 | Complete checkout with valid info | Positive | P1 | On checkout step one | Enter valid First Name, Last Name, Zip; click Continue | Redirected to `/checkout-step-two.html` (overview) |
| UI-031 | Checkout blank First Name | Negative | P1 | On checkout step one | Leave First Name blank, fill others; click Continue | Error "Error: First Name is required" |
| UI-032 | Checkout blank Last Name | Negative | P1 | On checkout step one | Leave Last Name blank, fill others; click Continue | Error "Error: Last Name is required" |
| UI-033 | Checkout blank Postal Code | Negative | P1 | On checkout step one | Leave Postal Code blank, fill others; click Continue | Error "Error: Postal Code is required" |
| UI-034 | Cancel on step one returns to cart | Positive | P3 | On checkout step one | Click "Cancel" | Redirected to `/cart.html` |
| UI-035 | Overview shows correct pricing | Positive | P1 | Items in cart, past step one | Reach checkout overview | Item Total, Tax, and Total reflect sum of item prices + tax; Total = Item Total + Tax |
| UI-036 | Cancel on overview returns to inventory | Positive | P3 | On checkout overview | Click "Cancel" | Redirected to `/inventory.html` |
| UI-037 | Finish completes order | Positive | P1 | On checkout overview | Click "Finish" | Redirected to `/checkout-complete.html`; "Thank you for your order!" confirmation shown |
| UI-038 | Back Home clears cart | Positive | P2 | On order confirmation page | Click "Back Home" | Redirected to inventory; cart badge is empty/absent |
| UI-039 | First Name upper-bound length | Boundary | P2 | On checkout step one | Enter 300-character string as First Name, valid Last Name/Zip; click Continue | No crash; proceeds to step two or renders gracefully (document actual truncation/behavior observed) |
| UI-040 | Postal Code accepts non-numeric input | Boundary | P3 | On checkout step one | Enter alphabetic/special-char string as Postal Code (e.g. `ABC-!@#`), valid names; click Continue | App has no format validation — proceeds to step two (documents lack of format constraint) |

### Session

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|
| UI-050 | Logout clears session | Positive | P2 | Logged in | Open hamburger menu; click "Logout" | Redirected to login page; browser back navigation does not restore inventory page (session cleared) |

---

## API Test Cases — JSONPlaceholder (`tests/api`)

Base URL: https://jsonplaceholder.typicode.com

### /posts

| ID | Title | Type | Priority | Steps | Expected Result |
|---|---|---|---|---|---|
| API-001 | GET all posts | Positive | P1 | GET `/posts` | 200; body is array of exactly 100 items; each has `userId`, `id`, `title`, `body` |
| API-002 | GET post by valid id | Positive | P1 | GET `/posts/1` | 200; body matches schema, `id === 1` |
| API-003 | GET post by non-existent id | Negative | P1 | GET `/posts/9999` | 404; body is `{}` |
| API-004 | Filter posts by userId | Positive | P2 | GET `/posts?userId=1` | 200; array returned; every item has `userId === 1` |
| API-005 | POST post with all fields | Positive | P1 | POST `/posts` body `{title, body, userId}` | 201; response echoes `title`/`body`/`userId` and adds `id: 101` |
| API-006 | POST post with required fields only | Positive | P1 | POST `/posts` body `{title, userId}` (no `body`) | 201; response includes provided fields + new `id`; documents that mock does not require `body` |
| API-007 | POST post missing all fields (mock non-validation) | Negative | P2 | POST `/posts` with `{}` | 201 returned (not 400) — asserts and documents JSONPlaceholder's non-validating mock behavior |
| API-008 | PUT full update of post | Positive | P1 | PUT `/posts/1` body `{id, title, body, userId}` | 200; response reflects updated fields |
| API-009 | PATCH partial update of post | Positive | P2 | PATCH `/posts/1` body `{title}` only | 200; response contains updated `title`, other original fields unchanged in response |
| API-010 | DELETE a post | Positive | P1 | DELETE `/posts/1` | 200; response body is `{}` |

### /comments (nested under posts)

| ID | Title | Type | Priority | Steps | Expected Result |
|---|---|---|---|---|---|
| API-020 | GET all comments | Positive | P1 | GET `/comments` | 200; array of exactly 500 items; each has `postId`,`id`,`name`,`email`,`body` |
| API-021 | GET comments nested under post | Positive | P1 | GET `/posts/1/comments` | 200; array returned; every item `postId === 1` |
| API-022 | GET comments filtered by postId (cross-check) | Positive | P2 | GET `/comments?postId=1` | 200; array length and ids match API-021 result exactly |
| API-023 | GET single comment by id | Positive | P2 | GET `/comments/1` | 200; schema valid; `email` matches basic email regex |
| API-024 | POST comment with required fields | Positive | P1 | POST `/comments` body `{postId, name, email, body}` | 201; response echoes payload + new `id` |
| API-025 | POST comment missing email (mock non-validation) | Negative | P2 | POST `/comments` body `{postId, name, body}` (no email) | 201 returned; documents lack of required-field enforcement |

### /albums & /photos (nested)

| ID | Title | Type | Priority | Steps | Expected Result |
|---|---|---|---|---|---|
| API-030 | GET all albums | Positive | P1 | GET `/albums` | 200; array of exactly 100 items; each has `userId`,`id`,`title` |
| API-031 | GET albums nested under user | Positive | P1 | GET `/users/1/albums` | 200; array returned; every item `userId === 1` |
| API-032 | GET photos nested under album | Positive | P1 | GET `/albums/1/photos` | 200; array returned; every item `albumId === 1` |
| API-033 | Filter photos by albumId (cross-check) | Positive | P2 | GET `/photos?albumId=1` | 200; array length/ids match API-032 result exactly |
| API-034 | POST album with required fields | Positive | P2 | POST `/albums` body `{userId, title}` | 201; response echoes payload + new `id` |

### /todos

| ID | Title | Type | Priority | Steps | Expected Result |
|---|---|---|---|---|---|
| API-040 | GET all todos | Positive | P1 | GET `/todos` | 200; array of exactly 200 items; each has `userId`,`id`,`title`,`completed` (boolean) |
| API-041 | GET todos nested under user | Positive | P1 | GET `/users/1/todos` | 200; array returned; every item `userId === 1` |
| API-042 | Filter completed todos | Positive | P2 | GET `/todos?completed=true` | 200; array returned; every item `completed === true` |
| API-043 | POST todo with required fields | Positive | P2 | POST `/todos` body `{userId, title, completed}` | 201; response echoes payload + new `id` |

### /users

| ID | Title | Type | Priority | Steps | Expected Result |
|---|---|---|---|---|---|
| API-050 | GET all users | Positive | P1 | GET `/users` | 200; array of exactly 10 items; each has full schema incl. nested `address.geo` and `company` |
| API-051 | GET single user by valid id | Positive | P1 | GET `/users/1` | 200; schema valid incl. nested `address` and `company` objects |
| API-052 | GET user by non-existent id | Negative | P1 | GET `/users/9999` | 404; body is `{}` |
| API-053 | POST user with required + optional fields | Positive | P1 | POST `/users` body incl. `name,username,email,address,phone,website,company` | 201; response echoes full payload + new `id` |
| API-054 | POST user with required fields only | Positive | P1 | POST `/users` body `{name, username, email}` only | 201; response echoes provided fields + new `id`; documents optional fields aren't enforced |
| API-055 | GET posts nested under user (cross-check) | Positive | P2 | GET `/users/1/posts` | 200; array returned; every item `userId === 1`; count matches API-004 filtered query for user 1 |

---

**Totals:** 34 UI cases, 31 API cases = 65 test cases.
