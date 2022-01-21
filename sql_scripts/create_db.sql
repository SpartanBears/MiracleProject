CREATE TABLE player_user (
    id bigserial NOT NULL PRIMARY KEY,
    login_email character varying (97) NOT NULL UNIQUE,
    login_key character varying (60) NOT NULL,
    display_name character varying (29) NOT NULL,
    is_active boolean NULL default 1,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_lastloginkeychange timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE INDEX player_user_email_idx ON player_user (login_email);
#-------------------------

CREATE TABLE major_god (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL,
);
#-------------------------

CREATE TABLE god_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL,
    gerund character varying (29) NOT NULL
);
#-------------------------

CREATE TABLE major_god_type (
    id bigserial NOT NULL PRIMARY KEY,
    major_god_id int NOT NULL,
    god_type_id int NOT NULL,
    CONSTRAINT fk_major_god
        FOREIGN KEY(major_god_id)
            REFERENCES major_god(id),
    CONSTRAINT fk_god_type
        FOREIGN KEY(god_type_id)
            REFERENCES god_type(id)
);

CREATE INDEX major_god_type_typeid_idx ON major_god_type (god_type_id);
#-------------------------

CREATE TABLE player_god (
    id bigserial NOT NULL PRIMARY KEY,
    player_user_id bigint NOT NULL,
    name character varying (29),
    is_active boolean NULL default 1,
    major_god_id int NOT NULL,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_player_user
        FOREIGN KEY(player_user_id)
            REFERENCES player_user(id),
    CONSTRAINT fk_major_god
        FOREIGN KEY(major_god_id)
            REFERENCES major_god(id)
);

CREATE INDEX player_god_user_idx ON player_god (player_user_id);
CREATE INDEX player_god_major_god_idx ON player_god (major_god_id);

CREATE TABLE familia (
    id bigserial NOT NULL PRIMARY KEY,
    player_god_id bigint NOT NULL,
    name character varying (29) NOT NULL,
    is_active boolean NULL default 1,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_player_god
        FOREIGN KEY(player_god_id)
            REFERENCES player_god(id)
);

CREATE INDEX familia_player_god_idx ON familia (player_god_id);
#-------------------------

CREATE TABLE npc_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL
);

CREATE TABLE npc_race (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL
);

CREATE TABLE npc_race_class (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL,
    npc_race_id int NOT NULL,
    CONSTRAINT fk_npc_race
        FOREIGN KEY(npc_race_id)
            REFERENCES npc_race(id)
);

CREATE TABLE npc (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL,
    npc_type_id int NOT NULL,
    npc_race_id int NOT NULL,
    npc_race_class_id int NOT NULL,
    stat_str int NOT NULL default 1,
    stat_agi int NOT NULL default 1,
    stat_vit int NOT NULL default 1,
    stat_int int NOT NULL default 1,
    stat_dex int NOT NULL default 1,
    stat_luk int NOT NULL default 1,
    npc_json character varying,
    npc_hash character varying (60),
    is_active boolean NULL default 1,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_npc_type
        FOREIGN KEY(npc_type_id)
            REFERENCES npc_type(id),
    CONSTRAINT fk_npc_race
        FOREIGN KEY(npc_race_id)
            REFERENCES npc_race(id),
    CONSTRAINT fk_npc_race_class
        FOREIGN KEY(npc_race_class_id)
            REFERENCES npc_race_class(id)
);

CREATE INDEX npc_type_idx ON npc (npc_type_id);
CREATE INDEX npc_race_idx ON npc (npc_race_id);
CREATE INDEX npc_race_class_idx ON npc (npc_race_class_id);

CREATE TABLE familia_npc (
    id bigserial NOT NULL PRIMARY KEY,
    npc_id bigint NOT NULL,
    familia_id bigint NOT NULL,
    is_active boolean NULL default 1,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_familia_npc
        FOREIGN KEY(npc_id)
            REFERENCES npc(id),
    CONSTRAINT fk_npc_familia
        FOREIGN KEY(familia_id)
            REFERENCES familia(id)
);

CREATE INDEX familia_npc_familia_idx ON familia_npc (familia_id);
#-------------------------

CREATE TABLE element (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL
);

CREATE TABLE item_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (29) NOT NULL
);

CREATE TABLE item (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (29),
    item_type_id int NOT NULL,
    element_id int NOT NULL,
    creator_npc_id bigint NOT NULL,
    item_level int NOT NULL,
    stat_str int default 0,
    stat_agi int default 0,
    stat_vit int default 0,
    stat_int int default 0,
    stat_dex int default 0,
    stat_luk int default 0,
    stat_hp int default 0,
    stat_def int default 0,
    stat_mdef int default 0,
    stat_eva int default 0,
    stat_atk int default 0,
    stat_matk int default 0,
    stat_aspd int default 0,
    stat_cspd int default 0,
    stat_hit int default 0,
    stat_crit int default 0,
    item_hash character varying (60),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_item_type
        FOREIGN KEY(item_type_id)
            REFERENCES item_type(id),
    CONSTRAINT fk_item_element
        FOREIGN KEY(element_id)
            REFERENCES element(id),
    CONSTRAINT fk_item_creator
        FOREIGN KEY(creator_npc_id)
            REFERENCES npc(id)
);

CREATE INDEX item_type_idx ON item (item_type_id);
CREATE INDEX item_element_idx ON item (element_id);
CREATE INDEX item_creator_idx ON item (creator_npc_id);