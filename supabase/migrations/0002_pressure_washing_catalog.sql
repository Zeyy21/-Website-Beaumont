-- Align existing Beaumont projects with the pressure-washing service catalogue.
-- Safe to run repeatedly: rows are matched by the original seeded names.

update public.services
set name = 'Driveway & Walkway Restoration',
    description = 'Concrete, stone, and pavers restored to a brighter, more welcoming arrival.',
    base_price = 80,
    rate_per_m2 = 2.2
where name = 'Residential Cleaning';

update public.services
set name = 'Patio & Pool Surround',
    description = 'Outdoor living surfaces refreshed with careful pressure and material-aware treatment.',
    base_price = 140,
    rate_per_m2 = 2.8
where name = 'Signature Deep Clean';

update public.services
set name = 'Gentle House Wash',
    description = 'A considered low-pressure exterior wash for siding, stucco, brick, and delicate finishes.',
    base_price = 160,
    rate_per_m2 = 2.4
where name = 'Move-In / Move-Out';

update public.services
set name = 'Complete Estate Exterior',
    description = 'A tailored restoration of the driveway, paths, terraces, walls, and outdoor living areas.',
    base_price = 240,
    rate_per_m2 = 3.2
where name = 'Estate & Luxury Care';
