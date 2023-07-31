INSERT INTO npc_type (name) VALUES ('adventurer');
INSERT INTO npc_type (name) VALUES ('dungeon_monster');

INSERT INTO npc_race (name) VALUES ('dwarf');

INSERT INTO npc_race_class (name, npc_race_id) VALUES ('merchant', (SELECT nr.id FROM npc_race nr WHERE nr.name = 'dwarf'));

INSERT INTO element (name, level) VALUES ('neutral', 1);
INSERT INTO element (name, level) VALUES ('neutral', 2);
INSERT INTO element (name, level) VALUES ('neutral', 3);
INSERT INTO element (name, level) VALUES ('neutral', 4);
INSERT INTO element (name, level) VALUES ('neutral', 5);

INSERT INTO element (name, level) VALUES ('water', 1);
INSERT INTO element (name, level) VALUES ('water', 2);
INSERT INTO element (name, level) VALUES ('water', 3);
INSERT INTO element (name, level) VALUES ('water', 4);
INSERT INTO element (name, level) VALUES ('water', 5);

INSERT INTO element (name, level) VALUES ('earth', 1);
INSERT INTO element (name, level) VALUES ('earth', 2);
INSERT INTO element (name, level) VALUES ('earth', 3);
INSERT INTO element (name, level) VALUES ('earth', 4);
INSERT INTO element (name, level) VALUES ('earth', 5);

INSERT INTO element (name, level) VALUES ('fire', 1);
INSERT INTO element (name, level) VALUES ('fire', 2);
INSERT INTO element (name, level) VALUES ('fire', 3);
INSERT INTO element (name, level) VALUES ('fire', 4);
INSERT INTO element (name, level) VALUES ('fire', 5);

INSERT INTO element (name, level) VALUES ('wind', 1);
INSERT INTO element (name, level) VALUES ('wind', 2);
INSERT INTO element (name, level) VALUES ('wind', 3);
INSERT INTO element (name, level) VALUES ('wind', 4);
INSERT INTO element (name, level) VALUES ('wind', 5);

INSERT INTO element (name, level) VALUES ('poison', 1);
INSERT INTO element (name, level) VALUES ('poison', 2);
INSERT INTO element (name, level) VALUES ('poison', 3);
INSERT INTO element (name, level) VALUES ('poison', 4);
INSERT INTO element (name, level) VALUES ('poison', 5);

INSERT INTO element (name, level) VALUES ('light', 1);
INSERT INTO element (name, level) VALUES ('light', 2);
INSERT INTO element (name, level) VALUES ('light', 3);
INSERT INTO element (name, level) VALUES ('light', 4);
INSERT INTO element (name, level) VALUES ('light', 5);

INSERT INTO element (name, level) VALUES ('shadow', 1);
INSERT INTO element (name, level) VALUES ('shadow', 2);
INSERT INTO element (name, level) VALUES ('shadow', 3);
INSERT INTO element (name, level) VALUES ('shadow', 4);
INSERT INTO element (name, level) VALUES ('shadow', 5);

INSERT INTO element (name, level) VALUES ('ghost', 1);
INSERT INTO element (name, level) VALUES ('ghost', 2);
INSERT INTO element (name, level) VALUES ('ghost', 3);
INSERT INTO element (name, level) VALUES ('ghost', 4);
INSERT INTO element (name, level) VALUES ('ghost', 5);

INSERT INTO element (name, level) VALUES ('undead', 1);
INSERT INTO element (name, level) VALUES ('undead', 2);
INSERT INTO element (name, level) VALUES ('undead', 3);
INSERT INTO element (name, level) VALUES ('undead', 4);
INSERT INTO element (name, level) VALUES ('undead', 5);

INSERT INTO element (name, level) VALUES ('divine', 1);
INSERT INTO element (name, level) VALUES ('divine', 2);
INSERT INTO element (name, level) VALUES ('divine', 3);
INSERT INTO element (name, level) VALUES ('divine', 4);
INSERT INTO element (name, level) VALUES ('divine', 5);

INSERT INTO item_type (name) VALUES ('armor');
INSERT INTO item_type (name) VALUES ('weapon');
INSERT INTO item_type (name) VALUES ('accesory');
INSERT INTO item_type (name) VALUES ('usable');