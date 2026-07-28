ALTER TABLE "Restaurant"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

UPDATE "Restaurant"
SET
  "latitude" = CASE "slug"
    WHEN 'burger-king' THEN 42.44124
    WHEN 'home-of-gyros' THEN 42.43963
    WHEN 'goodfellas' THEN 42.44424
    WHEN 'bbq-more-podgorica' THEN 42.43278
    WHEN 'green-protein' THEN 42.44042
    WHEN 'sushi-co' THEN 42.44181
    WHEN 'ulix' THEN 42.44522
    WHEN 'the-big-horn-gastropub' THEN 42.43897
    WHEN 'texas-chicken-podgorica' THEN 42.44236
    WHEN 'fast-food-calimero-rostilj' THEN 42.44086
    WHEN 'konoba-the-daltons' THEN 42.44309
    WHEN 'fast-food-gyros-radinovic' THEN 42.43931
    WHEN 'the-living-room' THEN 42.44138
    WHEN 'konoba-lanterna' THEN 42.44461
    WHEN 'nostalgija' THEN 42.44013
    WHEN 'picerija-bodiko' THEN 42.44612
    WHEN 'nama-sushi-coffee' THEN 42.43789
    WHEN 'sushi-market' THEN 42.43868
    WHEN 'baba-ganus' THEN 42.44372
    WHEN 'zdravo-bio' THEN 42.43803
    ELSE 42.44124
  END,
  "longitude" = CASE "slug"
    WHEN 'burger-king' THEN 19.26309
    WHEN 'home-of-gyros' THEN 19.23862
    WHEN 'goodfellas' THEN 19.26436
    WHEN 'bbq-more-podgorica' THEN 19.28417
    WHEN 'green-protein' THEN 19.23985
    WHEN 'sushi-co' THEN 19.24591
    WHEN 'ulix' THEN 19.24628
    WHEN 'the-big-horn-gastropub' THEN 19.25491
    WHEN 'texas-chicken-podgorica' THEN 19.26612
    WHEN 'fast-food-calimero-rostilj' THEN 19.26176
    WHEN 'konoba-the-daltons' THEN 19.26032
    WHEN 'fast-food-gyros-radinovic' THEN 19.26671
    WHEN 'the-living-room' THEN 19.24427
    WHEN 'konoba-lanterna' THEN 19.25874
    WHEN 'nostalgija' THEN 19.23483
    WHEN 'picerija-bodiko' THEN 19.23591
    WHEN 'nama-sushi-coffee' THEN 19.24817
    WHEN 'sushi-market' THEN 19.25811
    WHEN 'baba-ganus' THEN 19.26803
    WHEN 'zdravo-bio' THEN 19.23721
    ELSE 19.26309
  END;

ALTER TABLE "Restaurant"
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;
