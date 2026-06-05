# Product Description and Image Discrepancy Report

**Repository reviewed:** `Kmariana2/fix-bts-weverse-shop`  
**Clone source file reviewed:** `lib/data.ts`  
**Official source reviewed:** public BTS product/category pages on [Weverse Shop](https://shop.weverse.io/) as accessible on June 5, 2026.  
**Visual evidence:** `image_contact_sheet.jpg`, generated from clone assets and official listing thumbnails.

## Executive Summary

I found **several material discrepancies** between the clone’s product catalog and the official Weverse Shop pages. The most important issue is an **incorrect clone image** for **`[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)`**: the clone uses a red/black/white striped polo-style shirt, while the official Weverse listing shows a plain white j-hope tour T-shirt. I also found two ARIRANG clone products that I could not verify on the official ARIRANG category pages checked: **`[ARIRANG] Zip-up Hoodie (Black)`** and **`[ARIRANG] Knit Cardigan (Beige)`**.

The clone’s prices are generally accurate for the matched products, but several **description-related fields are incomplete or wrong** when compared with official detail pages. The most common discrepancies are **stock/status mismatches**, **size-option mismatches**, and **missing official product details** such as material, contents, manufacturer, country of manufacture, and official handling instructions.

## Methodology

I compared the clone’s product data from `lib/data.ts` against official Weverse Shop category and product detail pages. I reviewed the ARIRANG, RUNSEOKJIN, and HOPE ON THE STAGE pages and downloaded the official listing thumbnails for a side-by-side visual comparison. For product details, I extracted available official page text, including product names, material, size options, contents, manufacturer, country of manufacture, and status language.

> **Important limitation:** Weverse Shop is a dynamic storefront. Product availability, category visibility, prices, and regional shipping pages can change. This report reflects the official pages available during this review.

## High-Priority Discrepancies

| Severity | Clone product | Discrepancy | Evidence | Recommended action |
|---|---|---|---|---|
| High | `[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)` | **Wrong product image.** The clone image is `/images/stripe-polo-front.jpg`, showing a red/black/white striped polo-style shirt. The official Weverse image for `S/S T-Shirt (White)` shows a white T-shirt with the j-hope tour graphic.[^hope-tee] | See final row of `image_contact_sheet.jpg`. | Replace the clone image with the official white T-shirt image or a locally saved approved equivalent. |
| High | `[ARIRANG] Zip-up Hoodie (Black)` | **No matching official ARIRANG product found** in the official ARIRANG pages checked. The clone lists it at `USD $200.00` with stock `40`, but the official ARIRANG category data reviewed did not include this item. | No official match found in checked ARIRANG category/detail pages. | Remove the product unless a valid official Weverse URL can be provided. |
| High | `[ARIRANG] Knit Cardigan (Beige)` | **No matching official ARIRANG product found** in the official ARIRANG pages checked. The clone lists it at `USD $135.22` with stock `25`. | No official match found in checked ARIRANG category/detail pages. | Remove or reclassify only if a valid official Weverse product page is available. |
| Medium | Multiple matched products | **Stock/status mismatch.** The official matched pages show these items as sold out or sold-out listings, but the clone exposes nonzero stock values for many products. | Official categories/details showed sold-out status for many matched products. | Set stock to `0` or add an availability field that accurately reflects official sold-out/pre-order status. |
| Medium | Several ARIRANG and j-hope products | **Size-option mismatch.** The clone includes sizes not offered officially or omits sizes that are officially present. | Examples listed below. | Update `sizes` arrays to exactly match official product options. |

## Product-by-Product Findings

| Clone product | Official match | Description/data discrepancy | Image discrepancy | Status |
|---|---|---|---|---|
| `[ARIRANG] S/S T-Shirt (Charcoal)` | `[GLOBAL EXCLUSIVE] S/S T-Shirt (Charcoal)`[^arirang-charcoal] | Clone description is much shorter than official product information and omits material, contents, manufacturer, country, manufacture month, and care instructions. Clone stock is `100`, while official listing was sold out. | Image appears to match. | Needs stock/status and detail enrichment. |
| `[ARIRANG] S/S Photo T-Shirt (Black)` | `S/S Photo T-Shirt (Black)`[^arirang-photo] | Clone stock is `80`, while official listing was sold out. Clone description is summary-only and omits official detail fields. | Image is broadly consistent, but clone shows a larger cropped presentation than the official thumbnail. | Needs stock/status update and detail enrichment. |
| `[ARIRANG] S/S Tour T-Shirt (Black)` | `S/S Tour T-Shirt (Black)`[^arirang-tour-black] | Clone price and size options match. Clone stock is already `0`. Description omits official material `43% COTTON 42% NYLON 15% SPANDEX` and other detail fields. | Image appears to match. | Mostly correct; add official details if desired. |
| `[ARIRANG] S/S Crop T-Shirt (White)` | `[GLOBAL EXCLUSIVE] S/S Crop T-Shirt (White)`[^arirang-crop] | Clone sizes are `S, M, L`; official sizes are `S, M, L, XL`. Clone stock is `60`, while official listing was sold out. | Image is consistent, though clone and official thumbnail framing differ. | Add `XL`; set stock/status accurately. |
| `[ARIRANG] Zip-up Hoodie (Charcoal)` | `Zip-up Hoodie (Charcoal)`[^arirang-zip-charcoal] | Clone sizes include `XXL`; official sizes are only `S, M, L, XL`. | Image is consistent enough for a thumbnail-level match. | Remove `XXL`; add official material/details. |
| `[ARIRANG] Zip-up Hoodie (Black)` | No official match found | Product could not be verified on official ARIRANG pages checked. | Cannot validate against official image. | Remove unless an official URL is supplied. |
| `[ARIRANG] Hoodie & Pants Set-up (Gray)` | `Hoodie & Pants Set-up (Gray)`[^arirang-setup] | Clone sizes include `XXL`; official sizes are `S, M, L, XL`. Clone stock is `50`, while official listing was sold out. | Image appears related but clone shows only the hoodie, whereas official thumbnail shows both hoodie and pants. | Remove `XXL`; use an image showing the full set; update stock/status. |
| `[ARIRANG] Wind Jacket (Gray)` | `Wind Jacket (Gray)`[^arirang-wind] | Clone stock is `30`, while official listing was sold out. Description omits official material `100% POLYESTER`, manufacturer, country, and detailed care instructions. | Image appears consistent. | Update stock/status and add official details. |
| `[ARIRANG] Knit Cardigan (Beige)` | No official match found | Product could not be verified on official ARIRANG pages checked. | Cannot validate against official image. | Remove unless an official URL is supplied. |
| `[ARIRANG] S/S Jersey` | `S/S Jersey`[^arirang-jersey] | Clone sizes are `S, M, L, XL`; official sizes are `M(S-M)` and `XL(L-XL)`. Clone description says member variants, while the official detail page identifies a single `S/S Jersey` product page with option sizing. Clone stock is `100`, while official listing was sold out. | Clone image shows one jersey front; official listing thumbnail shows multiple jersey front/back/member variants. | Update size labels and use official-style multi-variant image if intended. |
| `[RUN SEOKJIN] EP.TOUR S/S T-Shirt (Encore Ver.)` | `S/S T-Shirt Encore Ver.`[^run-ss] | Clone name adds a prefix not shown in official listing, but price and image match. Clone stock is `70`, while official listing was sold out. | Image appears to match. | Update stock/status. |
| `[RUN SEOKJIN] EP.TOUR L/S T-Shirt (Encore Ver.)` | `L/S T-Shirt Encore Ver.`[^run-ls] | Clone name adds a prefix not shown in official listing. Clone stock is `40`, while official listing was sold out. | Image is consistent but framing differs. | Update stock/status. |
| `[RUN SEOKJIN] EP.TOUR Coach Jacket` | `Coach Jacket`[^run-coach] | Clone price matches. Clone stock is `20`, while official listing was sold out. | Image is related but official thumbnail includes an additional photo/card component next to the jacket; clone image shows only the jacket. | Update stock/status; consider using official complete thumbnail. |
| `[RUN SEOKJIN] EP.TOUR Denim Jacket` | `Denim Jacket`[^run-denim] | Clone price matches. Clone stock is `15`, while official listing was sold out. | Image appears to match, including the extra photo/card element. | Update stock/status. |
| `[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)` | `S/S T-Shirt (White)`[^hope-tee] | Clone price and sizes match official Korean-shipping item. Clone stock is `40`, while official listing was sold out. | **Wrong image:** clone uses striped polo image; official is a white T-shirt. | Replace image and update stock/status. |
| `[j-hope] HOPE ON THE STAGE Hoodie (Black)` | `Hoodie (Black)`[^hope-hoodie] | Clone sizes include `XXL`; official sizes are `S, M, L, XL`. Clone stock is `35`, while official listing was sold out. Official contents include `Hoodie 1EA + PHOTOCARD 1EA`, which clone description does not mention. | Image appears to match. | Remove `XXL`; update stock/status and contents. |

## Official Products Present on Weverse but Absent from the Clone

The clone is not a complete mirror of the official category pages. This may be intentional, but if the project goal is to match the current official catalog, the following official products are missing from the clone’s `products` array.

| Official category | Missing official product examples |
|---|---|
| ARIRANG | `S/S Tour T-Shirt (Gray)`, `BTS Official Light Stick Ver.4 Parts (Tour Korean Ver.)`, `[BTS X Urban Sophistication] Souvenir Bottle`, `Skateboard`, `[GLOBAL EXCLUSIVE] Photo Slogan Muffler`, `BTS Official Light Stick Bag`, `Multi Strap`, `Plush Keyring`, `Ball Cap (Black)`, `[GLOBAL EXCLUSIVE] Fabric Bag`, `Mini Skateboard Keyring` |
| RUNSEOKJIN | `Tour Mini Charm Incheon`, `Lucky Draw`, `S/S T-Shirt Wootteo Ver.`, `Tour Mini Charm`, `Back Pack`, `Image Picket`, `Fabric Poster`, `Magnetic Card Holder Ver. 4` |

## Recommended Fix List

| Priority | File/field | Change |
|---|---|---|
| 1 | `lib/data.ts` → `[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)` → `image` | Replace `/images/stripe-polo-front.jpg` with the correct official white T-shirt image asset. |
| 2 | `lib/data.ts` → `[ARIRANG] Zip-up Hoodie (Black)` | Remove or validate with an official Weverse product URL. |
| 3 | `lib/data.ts` → `[ARIRANG] Knit Cardigan (Beige)` | Remove or validate with an official Weverse product URL. |
| 4 | `stock` fields | Set matched sold-out products to `0`, or add explicit `status: "SOLD OUT"` / `availability` fields instead of relying on stock alone. |
| 5 | `sizes` fields | Remove unsupported `XXL` from ARIRANG Zip-up Hoodie Charcoal, ARIRANG Hoodie & Pants Set-up Gray, and j-hope Hoodie Black. Add `XL` to ARIRANG Crop T-Shirt White. Change ARIRANG Jersey sizes to `M(S-M)` and `XL(L-XL)`. |
| 6 | Product descriptions | Replace generic marketing descriptions with official factual information where appropriate, including material, contents, manufacturer, country of manufacture, manufacture month, and care/handling notices. |
| 7 | Set/image products | For product bundles or multi-variant products, use images that show the full official listing presentation: especially ARIRANG Hoodie & Pants Set-up Gray, ARIRANG S/S Jersey, and RUNSEOKJIN Coach Jacket. |

## Source References

[^arirang-charcoal]: Weverse Shop, `[GLOBAL EXCLUSIVE] S/S T-Shirt (Charcoal)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56495>.
[^arirang-photo]: Weverse Shop, `S/S Photo T-Shirt (Black)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56496>.
[^arirang-tour-black]: Weverse Shop, `S/S Tour T-Shirt (Black)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56493>.
[^arirang-crop]: Weverse Shop, `[GLOBAL EXCLUSIVE] S/S Crop T-Shirt (White)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56497>.
[^arirang-zip-charcoal]: Weverse Shop, `Zip-up Hoodie (Charcoal)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56490>.
[^arirang-setup]: Weverse Shop, `Hoodie & Pants Set-up (Gray)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56492>.
[^arirang-wind]: Weverse Shop, `Wind Jacket (Gray)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56491>.
[^arirang-jersey]: Weverse Shop, `S/S Jersey`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/56498>.
[^run-ss]: Weverse Shop, `S/S T-Shirt Encore Ver.`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/51280>.
[^run-ls]: Weverse Shop, `L/S T-Shirt Encore Ver.`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/51282>.
[^run-coach]: Weverse Shop, `Coach Jacket`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/40893>.
[^run-denim]: Weverse Shop, `Denim Jacket`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/40898>.
[^hope-tee]: Weverse Shop, `S/S T-Shirt (White)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/35855>.
[^hope-hoodie]: Weverse Shop, `Hoodie (Black)`, official product page: <https://shop.weverse.io/en/shop/USD/artists/2/sales/35854>.
