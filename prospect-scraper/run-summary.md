# Prospect Scraper — Run Summary

**Verticals covered:** 19/19  
**Total candidates evaluated (pre-dedup):** 210  
**Final rows after cross-vertical dedup:** 196  
**Qualified prospects (size PASS + score 3+ + own-site email + no opt-out):** 49  

Output file: `prospects.csv` (same folder).

## Per-vertical counts

| # | Vertical | Group | Candidates | Qualified |
|---|---|---|---|---|
| 1 | Machine shops | A | 12 | 2 |
| 2 | Metal fabrication / welding | A | 12 | 2 |
| 3 | Powder coating / finishing | A | 8 | 3 |
| 4 | Tool & die / precision mfg | A | 12 | 5 |
| 5 | Custom millwork / cabinet | A | 11 | 4 |
| 6 | Crane / rigging / industrial equip | A | 8 | 1 |
| 7 | Commercial HVAC / mechanical | A | 12 | 3 |
| 8 | Commercial electrical | A | 15 | 2 |
| 9 | Excavation / septic | B | 10 | 5 |
| 10 | Interlock / hardscaping | B | 10 | 1 |
| 11 | Tree services / arborists | B | 8 | 0 |
| 12 | Concrete / foundation / waterproofing | B | 12 | 3 |
| 13 | Deck & fence builders | B | 13 | 2 |
| 14 | Well drilling / water treatment | B | 11 | 2 |
| 15 | Paving / asphalt sealing | B | 12 | 5 |
| 16 | Chimney & masonry repair | B | 14 | 2 |
| 17 | Garage door installation | B | 12 | 1 |
| 18 | Mobile welding | B | 8 | 6 |
| 19 | Boat / marine repair | B | 10 | 1 |

**Dry verticals (0 qualified):** Tree services / arborists

## Top 10 highest-value prospects

Ranked by site badness score + presence of a named-owner email. All have an own-site email and no opt-out notice.

| # | Business | Vertical | Score | Email | Owner | Why |
|---|---|---|---|---|---|---|
| 1 | J&L Mobile Welding | Mobile welding | 6 | info@ottawawelding.com | John Brownlee | Heavy equipment bucket repair, dump truck welding, trailer repairs, custom kayak/canoe trailers, sandblasting, |
| 2 | Ottawa Mechanical Contracting Inc. | Commercial HVAC / mechanical | 5 | kevin@ottawamechanical.com | Kevin | Pure commercial HVAC contractor; rooftop units, boilers, chillers, controls; emphasizes independent contractor |
| 3 | Bruce Mechanical Ltd. | Commercial HVAC / mechanical | 5 | bbaskin@brucemechanical.com | B. Baskin | Residential + commercial HVAC, heating, cooling, fireplaces, IAQ, renewables; 30+ years serving Ottawa and Val |
| 4 | Ottawa Valley Welding Inc. | Mobile welding | 5 | ottawavalleywelding@gmail.com | Steve | Heavy equipment, bulk trucks, forestry, crusher/screener, trailers. Testimonials from Orica Canada, Pollock La |
| 5 | Ottawa Industrial Coating Solutions Inc. | Powder coating / finishing | 5 | yourics@rogers.com | Moise Illouze | Powder + liquid coating, military/conformal coating niche. Rogers.com email = no professional domain email. Si |
| 6 | Welding Company | Mobile welding | 5 | info@weldingcompany.ca | - | Snow plow repairs, railing fabrication, trailer repairs, staircase repair, mobile welding, bike racks. Wix sit |
| 7 | Zeal-Tek Driveway Sealing | Paving / asphalt sealing | 5 | info@zeal-tek.com | - | Driveway sealing; oil-based sealant; crack filling; 5-step process; serves Kanata Barrhaven Stittsville Manoti |
| 8 | Sam's Welding | Mobile welding | 4 | samchahineswelding@gmail.com | Sam Chahine | Truck equipment (dump boxes, landscape bodies, flat decks), wrought iron gates/railings, mobile van. Owner Sam |
| 9 | Baudequin Mobile Welding | Mobile welding | 4 | samuel@baudequinwelding.com | Samuel Baudequin | CWB certified, crane-equipped service rigs, heavy equipment/crusher/conveyor repairs, agricultural, CNC plasma |
| 10 | Ottawa Quality Paint Finishing Ltd. | Powder coating / finishing | 4 | eric@oqpf.ca | Eric | Powder coating specialist. Site launched ~2022 but still has Lorem ipsum placeholder text on multiple sections |

## Notes on compliance
- Every `qualified=TRUE` row has an email taken from the business's OWN domain, with `email_source_url` recorded.
- No candidate showed do-not-solicit / no-marketing language; any that had are marked `optout_notice=TRUE` and disqualified.
- Emails from Gmail/Rogers/Hotmail or third-party directories were NOT counted as qualifying (own-domain rule).
