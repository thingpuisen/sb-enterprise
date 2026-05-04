# Security Spec

## 1. Data Invariants
- A `Product` must have a valid string ID.
- `Product` entries can only be created, updated, or deleted by authenticated admins.
- Admins are users whose UID exists in the `/admins/{userId}` collection or whose email matches the bootstrapped admin email `jhlalrinawma3194@gmail.com`.
- Anyone can read the `/products` collection (public storefront).

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Read Admin**: An unauthenticated user tries to read the `admins` collection.
2. **Unauthenticated Write Product**: An unauthenticated user tries to create a product.
3. **Authenticated Non-Admin Write**: A regular authenticated user tries to update a product.
4. **Bootstrapped Admin Write**: The user `jhlalrinawma3194@gmail.com` tries to create a product.
5. **Collection Member Admin Write**: A user not matching the bootstrapped email but listed in `/admins/` tries to create a product.
6. **Shadow Update Test**: An admin tries to create a product with an extra field like `isFeatured: true` which is not in the schema.
7. **Value Poisoning**: An admin tries to set `price` to a string instead of a number.
8. **Size Limits**: An admin tries to set the product name to a string larger than 128 characters.
9. **Missing Fields**: An admin creates a product without a `price` field.
10. **ID Poisoning**: An admin creates a product with a malicious ID path `../products/malicious`.
11. **Timestamp Forgery**: An admin creates a product where `createdAt` is a past date instead of `request.time`.
12. **Immutable Field Change**: An admin tries to change `createdAt` during an update.

## 3. Test Runner
We will construct `firestore.rules.test.ts` to assert these conditions.
