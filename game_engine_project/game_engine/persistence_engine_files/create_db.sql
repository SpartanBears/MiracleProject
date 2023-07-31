----------------------------------------------------------------------------------------------------
--PLAYER RELATED

CREATE TABLE player_user (
    id bigserial NOT NULL PRIMARY KEY,
    login_email character varying (320) NOT NULL UNIQUE,
    login_key character varying NOT NULL,
    display_name character varying (50) NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_lastloginkeychange timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE player_session (
    id bigserial NOT NULL PRIMARY KEY,
    player_user_id bigint NOT NULL,
    session_token character varying NOT NULL,
    session_meta character varying NULL,
    session_socket character varying (20) NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_player_session_user
        FOREIGN KEY(player_user_id)
            REFERENCES player_user(id) ON DELETE CASCADE
);

CREATE INDEX player_session_player_id_idx ON player_session (player_user_id);

----------------------------------------------------------------------------------------------------
-- GOD RELATED

CREATE TABLE major_god (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE god_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    gerund character varying (50) NOT NULL, -- of Blacksmithing, of War, of Research, of Wisdom (?) 
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE major_god_type (
    id bigserial NOT NULL PRIMARY KEY,
    major_god_id int NOT NULL,
    god_type_id int NOT NULL,
    CONSTRAINT fk_major_god
        FOREIGN KEY(major_god_id)
            REFERENCES major_god(id) ON DELETE CASCADE,
    CONSTRAINT fk_god_type
        FOREIGN KEY(god_type_id)
            REFERENCES god_type(id) ON DELETE CASCADE
);

CREATE INDEX major_god_type_typeid_idx ON major_god_type (god_type_id);

CREATE TABLE player_major_god (
    id bigserial NOT NULL PRIMARY KEY,
    player_user_id bigint NOT NULL,
    name character varying (50),
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    major_god_id int NOT NULL,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_player_user
        FOREIGN KEY(player_user_id)
            REFERENCES player_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_major_god
        FOREIGN KEY(major_god_id)
            REFERENCES major_god(id) ON DELETE SET NULL
);

CREATE INDEX player_god_major_god_idx ON player_god (major_god_id);

----------------------------------------------------------------------------------------------------
-- INVENTORY RELATED

CREATE TABLE inventory (
    id bigserial NOT NULL PRIMARY KEY,
    ts_lastupdate timestamp NULL default (now() at time zone 'utc'),
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE inventory_item (
    id bigserial NOT NULL PRIMARY KEY,
    inventory_id bigint NOT NULL,
    item_id bigint NOT NULL,
    item_count int NOT NULL default 1,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_inventory_item_inventory
        FOREIGN KEY (inventory_id)
            REFERENCES inventory (id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_item_item
        FOREIGN KEY (item_id)
            REFERENCES item (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- NPC RELATED

CREATE TABLE stat (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25) NOT NULL, -- Strength, Agility, Vitality, Intelligence, Dexterity, Luck
    short_name character varying (15) NOT NULL, -- str, agi, vit, int, dex, luk 
    description character varying,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE attribute (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25) NOT NULL, -- Hit Points, Mana Points, Defense, Magic Defense, Evasion, Attack, Magic Attack, Attack Speed, Cast Speed, Action Speed, Hit Chance, Critical Chance, Perfect Dodge
    short_name character varying (15) NOT NULL, -- hp, mp, def, mdef, eva, atk, matk, aspd, cspd, hit, crit, pdg
    description character varying,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE npc_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL, -- adventurer, dungeon_monster
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE npc_race (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE npc_race_class (
    id serial NOT NULL PRIMARY KEY,
    display_name character varying (50) NOT NULL,
    name character varying (50) NOT NULL,
    npc_race_id int NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_npc_race
        FOREIGN KEY(npc_race_id)
            REFERENCES npc_race(id) ON DELETE CASCADE
);

CREATE TABLE npc_race_class_tree (
    current_npc_race_class_id int NOT NULL,
    next_node_direction_code smallint NOT NULL, -- -1 prev 1 next
    next_node_npc_race_class_id int NOT NULL,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_current_npc_race_class_id
        FOREIGN KEY(current_npc_race_class_id)
            REFERENCES npc_race_class(id) ON DELETE CASCADE,
    CONSTRAINT fk_next_node_npc_race_class_id
        FOREIGN KEY(next_node_npc_race_class_id)
            REFERENCES npc_race_class(id) ON DELETE CASCADE
);

CREATE TABLE npc (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    npc_type_id int NOT NULL,
    npc_race_id int NOT NULL,
    base_level smallint NOT NULL default 1,
    base_level_exp_current bigint NOT NULL default 0,
    base_level_exp_total bigint NOT NULL default 0,
    npc_hash character varying NOT NULL,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    CONSTRAINT fk_npc_type
        FOREIGN KEY(npc_type_id)
            REFERENCES npc_type(id) ON DELETE SET NULL,
    CONSTRAINT fk_npc_race
        FOREIGN KEY(npc_race_id)
            REFERENCES npc_race(id) ON DELETE CASCADE
);

CREATE INDEX npc_type_idx ON npc (npc_type_id);
CREATE INDEX npc_race_idx ON npc (npc_race_id);

CREATE TABLE npc_stat (
    npc_id bigint NOT NULL,
    stat_id int NOT NULL,
    value int NOT NULL default 1,
    prev_value int NOT NULL default 1,
    ts_valuechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_npc_id
        FOREIGN KEY(npc_id)
            REFERENCES npc(id) ON DELETE CASCADE,
    CONSTRAINT fk_stat_id
        FOREIGN KEY(stat_id)
            REFERENCES stat(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX npc_stat_uid ON npc_stat (npc_id, stat_id);

CREATE TABLE npc_attribute (
    npc_id bigint NOT NULL,
    attr_id int NOT NULL,
    value int NOT NULL default 1,
    prev_value int NOT NULL default 1,
    ts_valuechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_npc_id
        FOREIGN KEY(npc_id)
            REFERENCES npc(id) ON DELETE CASCADE,
    CONSTRAINT fk_attr_id
        FOREIGN KEY(attr_id)
            REFERENCES attribute(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX npc_attribute_uid ON npc_attribute (npc_id, attr_id);

CREATE TABLE npc_class_progress (
    npc_id bigint NOT NULL,
    npc_race_class_id bigint NOT NULL,
    class_level smallint NOT NULL default 1,
    class_level_exp_current bigint NOT NULL default 0,
    class_level_exp_total bigint NOT NULL default 0,
    CONSTRAINT fk_npc_id
        FOREIGN KEY(npc_id)
            REFERENCES npc(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_race_class_id
        FOREIGN KEY(npc_race_class_id)
            REFERENCES npc_race_class(id) ON DELETE CASCADE
);

CREATE TABLE npc_inventory (
    npc_id bigint NOT NULL,
    inventory_id bigint NOT NULL,
    CONSTRAINT fk_npc_inventory_npc
        FOREIGN KEY (npc_id)
            REFERENCES npc (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_inventory_inventory
        FOREIGN KEY (inventory_id)
            REFERENCES inventory (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- MISC

CREATE TABLE value_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25) NOT NULL, --string, number
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE misc_property_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- weight, color, smell, gravity_pull, material, whatever
    value_type_id int NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_misc_property_type_value
        FOREIGN KEY (value_type_id)
            REFERENCES value_type (id) ON DELETE SET NULL
);

CREATE TABLE effect_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- restore, deplete, increase, decrease, set
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE effect_applied_as (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- flat, percent
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE target_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- self, other, allies, enemies, all
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

----------------------------------------------------------------------------------------------------
-- SKILL RELATED

CREATE TABLE npc_skill_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- damage, buff, debuff
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE npc_skill_cast_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (25), -- instant, incantation, passive
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE npc_skill(
    id bigserial NOT NULL PRIMARY KEY,
    npc_race_class_id int NOT NULL,
    npc_skill_type_id int NOT NULL,
    npc_skill_cast_type_id int NOT NULL,
    display_name character varying (50) NOT NULL,
    name character varying (50) NOT NULL,
    description character varying,
    CONSTRAINT fk_npc_skill_class
        FOREIGN KEY (npc_race_class_id)
            REFERENCES npc_race_class (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_type
        FOREIGN KEY (npc_skill_type_id)
            REFERENCES npc_skill_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_cast
        FOREIGN KEY (npc_skill_cast_type_id)
            REFERENCES npc_skill_cast_type (id) ON DELETE CASCADE
);

CREATE TABLE npc_skill_requirement (
    id bigserial NOT NULL PRIMARY KEY,
    npc_skill_id bigint NOT NULL,
    base_level int NOT NULL default 0,
    class_level int NOT NULL default 0,
    CONSTRAINT fk_npc_skill_requirement_skill
        FOREIGN KEY (npc_skill_id)
            REFERENCES npc_skill (id) ON DELETE CASCADE
);

CREATE TABLE npc_skill_requirement_stat (
    id bigserial NOT NULL PRIMARY KEY,
    stat_id int NOT NULL,
    npc_skill_requirement_id bigint NOT NULL,
    value int NOT NULL default 0,
    CONSTRAINT fk_npc_skill_requirement_stat
        FOREIGN KEY (stat_id)
            REFERENCES stat (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_requirement_stat_requirement
        FOREIGN KEY (npc_skill_requirement_id)
            REFERENCES npc_skill_requirement (id) ON DELETE CASCADE
);

CREATE TABLE npc_skill_requirement_attribute (
    id bigserial NOT NULL PRIMARY KEY,
    attr_id int NOT NULL,
    npc_skill_requirement_id bigint NOT NULL,
    value int NOT NULL default 0,
    CONSTRAINT fk_npc_skill_requirement_attribute
        FOREIGN KEY (attr_id)
            REFERENCES attribute (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_requirement_attr_requirement
        FOREIGN KEY (npc_skill_requirement_id)
            REFERENCES npc_skill_requirement (id) ON DELETE CASCADE
);

CREATE TABLE npc_skill_target_stat_effect (
    id bigserial NOT NULL PRIMARY KEY,
    stat_id int NOT NULL,
    npc_skill_id bigint NOT NULL,
    target_type_id int NOT NULL,
    effect_type_id int NOT NULL,
    effect_applied_as_id int NOT NULL,
    value int NOT NULL default 0,
    duration int NOT NULL default 0,
    CONSTRAINT fk_npc_skill_target_stat_effect_stat
        FOREIGN KEY(stat_id)
            REFERENCES stat(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_stat_effect_skill
        FOREIGN KEY(npc_skill_id)
            REFERENCES npc_skill(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_stat_effect_targettype
        FOREIGN KEY (target_type_id)
            REFERENCES target_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_stat_effect_effect
        FOREIGN KEY (effect_type_id)
            REFERENCES effect_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_stat_effect_applied_as
        FOREIGN KEY (effect_applied_as_id)
            REFERENCES effect_applied_as (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX  npc_skill_target_stat_effect_skill_uid ON npc_skill_target_stat_effect (stat_id, npc_skill_id);

CREATE TABLE npc_skill_target_attribute_effect (
    id bigserial NOT NULL PRIMARY KEY,
    attr_id int NOT NULL,
    npc_skill_id bigint NOT NULL,
    target_type_id int NOT NULL,
    effect_type_id int NOT NULL,
    effect_applied_as_id int NOT NULL,
    value int NOT NULL default 0,
    duration int NOT NULL default 0,
    CONSTRAINT fk_npc_skill_target_attribute_effect_attr
        FOREIGN KEY(attr_id)
            REFERENCES attribute(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_attribute_effect_skill
        FOREIGN KEY(npc_skill_id)
            REFERENCES npc_skill(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_attribute_effect_targettype
        FOREIGN KEY (target_type_id)
            REFERENCES target_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_attribute_effect_effect
        FOREIGN KEY (effect_type_id)
            REFERENCES effect_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_skill_target_attribute_effect_applied_as
        FOREIGN KEY (effect_applied_as_id)
            REFERENCES effect_applied_as (id) ON DELETE CASCADE        
);

CREATE UNIQUE INDEX  npc_skill_target_attribute_effect_skill_uid ON npc_skill_target_attribute_effect (attr_id, npc_skill_id);

----------------------------------------------------------------------------------------------------
-- FAMILIA RELATED

CREATE TABLE familia (
    id bigserial NOT NULL PRIMARY KEY,
    player_god_id bigint NOT NULL,
    name character varying (50) NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_player_god
        FOREIGN KEY(player_god_id)
            REFERENCES player_god(id) ON DELETE CASCADE
);

CREATE INDEX familia_player_god_idx ON familia (player_god_id);

CREATE TABLE familia_npc (
    id bigserial NOT NULL PRIMARY KEY,
    npc_id bigint NOT NULL,
    familia_id bigint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_familia_npc
        FOREIGN KEY(npc_id)
            REFERENCES npc(id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_familia
        FOREIGN KEY(familia_id)
            REFERENCES familia(id) ON DELETE CASCADE
);

CREATE INDEX familia_npc_familia_idx ON familia_npc (familia_id);

CREATE TABLE familia_inventory (
    familia_id bigint NOT NULL,
    inventory_id bigint NOT NULL,
    CONSTRAINT fk_familia_inventory_familia
        FOREIGN KEY (familia_id)
            REFERENCES familia (id) ON DELETE CASCADE,
    CONSTRAINT fk_npc_inventory_inventory
        FOREIGN KEY (inventory_id)
            REFERENCES inventory (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- GUILD RELATED

CREATE TABLE guild (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (25) NOT NULL,
    tag character varying (4) NOT NULL,
    founder_familia_id bigserial NOT NULL, --whenever a guild is created it MUST have a founding familia
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_guild_founder_familia
        FOREIGN KEY (familia_id)
            REFERENCES familia (id) ON DELETE SET NULL --if familia gets deleted by some misterious reason, we cannot delete the guild
);

CREATE TABLE guild_permission (
    id smallint NOT NULL PRIMARY KEY,
    display_name character varying (50),
    name character varying (50), -- guild_inventory, guild_invite, guild_expel, guild_manage
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE guild_familia (
    id bigserial NOT NULL PRIMARY KEY,
    guild_id bigint NOT NULL,
    familia_id bigint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_guild_familia_guild
        FOREIGN KEY (guild_id)
            REFERENCES guild (id) ON DELETE CASCADE,
    CONSTRAINT fk_guild_familia_familia
        FOREIGN KEY (familia_id)
            REFERENCES familia (id) ON DELETE CASCADE
);

CREATE TABLE guild_inventory (
    guild_id bigint NOT NULL,
    inventory_id bigint NOT NULL,
    CONSTRAINT fk_guild_inventory_guild
        FOREIGN KEY (guild_id)
            REFERENCES guild (id) ON DELETE CASCADE,
    CONSTRAINT fk_guild_inventory_inventory
        FOREIGN KEY (inventory_id)
            REFERENCES inventory (id) ON DELETE CASCADE
);

CREATE TABLE guild_role(
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (50), --Founder, Thane, Soldier, Newbie, whatever
    guild_id bigint NOT NULL,
    weight smallint NOT NULL default 0, -- lower weight cannot modify greater or equal weight member
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_guild_role_guild
        FOREIGN KEY (guild_id)
            REFERENCES guild (id) ON DELETE CASCADE
);

CREATE TABLE guild_role_permission (
    id bigserial NOT NULL PRIMARY KEY,
    guild_role_id bigint NOT NULL,
    guild_permission_id smallint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_guild_role_permission_role
        FOREIGN KEY (guild_role_id)
            REFERENCES guild_role (id) ON DELETE CASCADE,
    CONSTRAINT fk_guild_role_permission_permission
        FOREIGN KEY (guild_permission)
            REFERENCES guild_permission (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- BUILDING RELATED

CREATE TABLE building (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    base_level smallint NOT NULL DEFAULT 1,
    base_level_exp_current bigint NOT NULL DEFAULT 0,
    base_level_exp_total bigint NOT NULL DEFAULT 0,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE building_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50), -- outpost, store, temple, shrine, tavern
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE building_type_registry (
    id bigserial NOT NULL PRIMARY KEY,
    building_id bigint NOT NULL,
    building_type_id int NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_building_type_registry_building
        FOREIGN KEY (building_id)
            REFERENCES building (id) ON DELETE CASCADE,
    CONSTRAINT fk_building_type_registry_type
        FOREIGN KEY (building_type_id)
            REFERENCES building_type (id) ON DELETE CASCADE
);

CREATE TABLE building_familia ( --stores, 
    id bigserial NOT NULL PRIMARY KEY,
    familia_id bigint NOT NULL,
    building_id bigint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_building_familia_familia
        FOREIGN KEY (familia_id)
            REFERENCES familia (id) ON DELETE CASCADE,
    CONSTRAINT fk_building_familia_building
        FOREIGN KEY (building_id)
            REFERENCES building (id) ON DELETE CASCADE
);

CREATE TABLE building_guild ( --outposts, store
    id bigserial NOT NULL PRIMARY KEY,
    guild_id bigint NOT NULL,
    building_id bigint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_building_guild_guild
        FOREIGN KEY (guild_id)
            REFERENCES guild (id) ON DELETE CASCADE,
    CONSTRAINT fk_building_guild_building
        FOREIGN KEY (building_id)
            REFERENCES building (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- ITEM RELATED

CREATE TABLE element (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL, -- neutral, shadow, wind, earth, divine, etc
    level smallint NOT NULL,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE UNIQUE INDEX element_name_level_uid ON element (name, level);

CREATE TABLE item_type (
    id serial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL, -- armor, weapon, accesory, usable
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc')
);

CREATE TABLE item (
    id bigserial NOT NULL PRIMARY KEY,
    name character varying (50) NOT NULL,
    item_type_id int NOT NULL,
    creator_npc_id bigint NOT NULL,
    item_hash character varying,
    is_active boolean NULL default true,
    is_deleted boolean NULL default false,
    ts_activestatechange timestamp NULL default (now() at time zone 'utc'),
    ts_rowcreation timestamp NULL default (now() at time zone 'utc'),
    CONSTRAINT fk_item_type
        FOREIGN KEY(item_type_id)
            REFERENCES item_type(id) ON DELETE SET NULL,
    CONSTRAINT fk_item_creator
        FOREIGN KEY(creator_npc_id)
            REFERENCES npc(id) ON DELETE SET NULL
);

CREATE INDEX item_type_idx ON item (item_type_id);
CREATE INDEX item_creator_idx ON item (creator_npc_id);

CREATE TABLE item_misc_property (
    id bigserial NOT NULL PRIMARY KEY,
    item_id bigint NOT NULL,
    misc_property_type_id int NOT NULL,
    value character varying, -- value can be a number or a string. it depends on the misc_property_type -> value_type
    CONSTRAINT fk_item_misc_property_item
        FOREIGN KEY (item_id)
            REFERENCES item (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_misc_property_value
        FOREIGN KEY (value_type_id)
            REFERENCES value_type (id) ON DELETE SET NULL
);

CREATE TABLE item_element (
    id bigserial NOT NULL PRIMARY KEY,
    item_id bigint NOT NULL,
    element_id int NOT NULL,
    CONSTRAINT fk_item_element_item
        FOREIGN KEY (item_id)
            REFERENCES item (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_element_element
        FOREIGN KEY (element_id)
            REFERENCES element (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX item_element_uid ON item_element (item_id, element_id);

CREATE TABLE item_target_stat_effect (
    id bigserial NOT NULL PRIMARY KEY,
    item_id bigint NOT NULL,
    stat_id int NOT NULL,
    effect_type_id int NOT NULL,
    effect_applied_as_id int NOT NULL,
    value int NOT NULL default 0,
    duration int NOT NULL default 0,
    CONSTRAINT fk_item_target_stat_item
        FOREIGN KEY (item_id)
         REFERENCES item (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_stat_stat
        FOREIGN KEY (stat_id)
            REFERENCES stat (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_stat_effect_type
        FOREIGN KEY (effect_type_id)
            REFERENCES effect_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_stat_effect_type_applied_as
        FOREIGN KEY (effect_applied_as_id)
            REFERENCES effect_applied_as (id) ON DELETE CASCADE
);

CREATE TABLE item_target_attribute_effect (
    id bigserial NOT NULL PRIMARY KEY,
    item_id bigint NOT NULL,
    attr_id int NOT NULL,
    effect_type_id int NOT NULL,
    effect_applied_as_id int NOT NULL,
    value int NOT NULL default 0,
    duration int NOT NULL default 0,
    CONSTRAINT fk_item_target_item
        FOREIGN KEY (item_id)
         REFERENCES item (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_attr
        FOREIGN KEY (attr_id)
            REFERENCES attribute (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_attr_effect_type
        FOREIGN KEY (effect_type_id)
            REFERENCES effect_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_target_attr_effect_type_applied_as
        FOREIGN KEY (effect_applied_as_id)
            REFERENCES effect_applied_as (id) ON DELETE CASCADE
);

CREATE TABLE item_requirement (
    id bigserial NOT NULL PRIMARY KEY,
    item_id bigint NOT NULL,
    npc_base_level smallint default 0,
    npc_race_class_id int default NULL,
    npc_class_level smallint default 0,
    CONSTRAINT fk_item_requirement
        FOREIGN KEY(item_id)
            REFERENCES item(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_requirement_class
        FOREIGN KEY (npc_race_class_id)
            REFERENCES npc_race_class (id) ON DELETE CASCADE
);

CREATE TABLE item_requirement_stat (
    id bigserial NOT NULL PRIMARY KEY,
    item_requirement_id bigint NOT NULL,
    stat_id int NOT NULL,
    value int NOT NULL default 0,
    CONSTRAINT fk_item_requirement_stat_item_req
        FOREIGN KEY (item_requirement_id)
            REFERENCES item_requirement (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_requirement_stat_stat
        FOREIGN KEY (stat_id)
            REFERENCES stat (id) ON DELETE CASCADE
);

CREATE TABLE item_requirement_attribute (
    id bigserial NOT NULL PRIMARY KEY,
    item_requirement_id bigint NOT NULL,
    attr_id int NOT NULL,
    value int NOT NULL default 0,
    CONSTRAINT fk_item_requirement_attr_item_req
        FOREIGN KEY (item_requirement_id)
            REFERENCES item_requirement (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_requirement_attr
        FOREIGN KEY (attr_id)
            REFERENCES attribute (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------
-- COMBAT RELATED

CREATE TABLE combat_log (
    id bigserial NOT NULL PRIMARY KEY,
    combat_json character varying NOT NULL,
    is_deleted boolean NULL default false,
    ts_rowcreation timestamp NULL default (now() at time zone 'utc')
);

CREATE INDEX combat_log_rowcreation_idx ON combat_log (ts_rowcreation);

CREATE TABLE combat_log_player_god (
    id bigserial NOT NULL PRIMARY KEY,
    combat_log_id bigint NOT NULL,
    player_god_id bigint NOT NULL,
    CONSTRAINT fk_combat_log_player_god_log
        FOREIGN KEY (combat_log_id)
            REFERENCES combat_log (id) ON DELETE CASCADE,
    CONSTRAINT fk_combat_log_player_god_god
        FOREIGN KEY (player_god_id)
            REFERENCES player_god (id) ON DELETE CASCADE
);

----------------------------------------------------------------------------------------------------

INSERT INTO npc_type (name) VALUES ('adventurer');
INSERT INTO npc_type (name) VALUES ('dungeon_monster');

INSERT INTO npc_race (name) VALUES ('dwarf');

INSERT INTO stat (name, short_name, description) VALUES ('Strength', 'str', 'Influences the attack power of the adventurer, as well as the weight able to carry');
INSERT INTO stat (name, short_name, description) VALUES ('Agility', 'agi', 'Determines how fast an adventurer can attack. It also increases the chances to dodge an attack');
INSERT INTO stat (name, short_name, description) VALUES ('Vitality', 'vit', 'Increases the physical resistance of the adventurer');
INSERT INTO stat (name, short_name, description) VALUES ('Intelligence', 'int', 'Allows the adventurer to cast more powerful spells. It also aids in the day to day decision making');
INSERT INTO stat (name, short_name, description) VALUES ('Dexterity', 'dex', 'Have an effect on the adventurer aim, as well as the speed with he cast spells');
INSERT INTO stat (name, short_name, description) VALUES ('Luck', 'luk', 'Shows how much Lady Luck is on his side. Represents how much risk the adventurer is willing to take. "Fortune favors the brave"');

INSERT INTO attribute (name, short_name, description) VALUES ('Hit Points', 'hp', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Mana Points', 'mp', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Defense', 'def', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Magic Defense', 'mdef', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Evasion', 'eva', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Attack', 'atk', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Magic Attack', 'matk', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Attack Speed', 'aspd', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Cast Speed', 'cspd', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Action Speed', 'actspd', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Hit Chance', 'hit', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Crit Chance', 'crit', '');
INSERT INTO attribute (name, short_name, description) VALUES ('Perfect Dodge', 'perfect_dodge', '');


INSERT INTO effect_type (name) VALUES ('restore');
INSERT INTO effect_type (name) VALUES ('deplete');
INSERT INTO effect_type (name) VALUES ('increase');
INSERT INTO effect_type (name) VALUES ('decrease');
INSERT INTO effect_type (name) VALUES ('set');

INSERT INTO effect_applied_as (name) VALUES ('flat');
INSERT INTO effect_applied_as (name) VALUES ('percent');

INSERT INTO npc_skill_cast_type (name) VALUES ('instant');
INSERT INTO npc_skill_cast_type (name) VALUES ('incantation');
INSERT INTO npc_skill_cast_type (name) VALUES ('passive');

INSERT INTO npc_skill_type (name) VALUES ('damage');
INSERT INTO npc_skill_type (name) VALUES ('buff');
INSERT INTO npc_skill_type (name) VALUES ('debuff');

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

INSERT INTO target_type (name) VALUES ('self');
INSERT INTO target_type (name) VALUES ('other');
INSERT INTO target_type (name) VALUES ('allies');
INSERT INTO target_type (name) VALUES ('enemies');
INSERT INTO target_type (name) VALUES ('all');

-- CREATE CLASS START
INSERT INTO npc_race_class (display_name, name, npc_race_id) VALUES ('Merchant', 'merchant', (SELECT nr.id FROM npc_race nr WHERE nr.name = 'dwarf'));
INSERT INTO npc_race_class (display_name,name, npc_race_id) VALUES ('Trader', 'trader', (SELECT nr.id FROM npc_race nr WHERE nr.name = 'dwarf'));
INSERT INTO npc_race_class (display_name, name, npc_race_id) VALUES ('Master Trader', 'master_trader', (SELECT nr.id FROM npc_race nr WHERE nr.name = 'dwarf'));

INSERT INTO npc_race_class_tree (current_npc_race_class_id, next_node_direction_code, next_node_npc_race_class_id) 
VALUES ((SELECT id FROM npc_race_class WHERE name LIKE 'merchant'), 1, (SELECT id FROM npc_race_class WHERE name LIKE 'trader'));

INSERT INTO npc_race_class_tree (current_npc_race_class_id, next_node_direction_code, next_node_npc_race_class_id) 
VALUES ((SELECT id FROM npc_race_class WHERE name LIKE 'trader'), -1, (SELECT id FROM npc_race_class WHERE name LIKE 'merchant'));

INSERT INTO npc_race_class_tree (current_npc_race_class_id, next_node_direction_code, next_node_npc_race_class_id) 
VALUES ((SELECT id FROM npc_race_class WHERE name LIKE 'trader'), 1, (SELECT id FROM npc_race_class WHERE name LIKE 'master_trader'));

INSERT INTO npc_race_class_tree (current_npc_race_class_id, next_node_direction_code, next_node_npc_race_class_id) 
VALUES ((SELECT id FROM npc_race_class WHERE name LIKE 'master_trader'), -1, (SELECT id FROM npc_race_class WHERE name LIKE 'trader'));
-- CREATE CLASS END

-- CREATE SKILL START
INSERT INTO npc_skill (display_name, name, npc_race_class_id, npc_skill_type_id, npc_skill_cast_type_id) 
VALUES ('Mammonite', 'mammonite', 
        (SELECT id FROM npc_race_class WHERE name = 'merchant'), 
        (SELECT id FROM npc_skill_type WHERE name = 'damage'),
        (SELECT id FROM npc_skill_cast_type WHERE name = 'instant'));

INSERT INTO npc_skill_requirement (npc_skill_id, base_level, class_level) 
VALUES ((SELECT id FROM npc_skill WHERE name = 'mammonite'), 5, 1);

INSERT INTO npc_skill_requirement_stat (stat_id, value, npc_skill_requirement_id)
VALUES ((SELECT id FROM stat WHERE short_name = 'str'), 
        15, 
        (SELECT nsr.id FROM npc_skill_requirement nsr INNER JOIN npc_skill ns ON nsr.npc_skill_id = ns.id WHERE ns.name = 'mammonite'));

INSERT INTO npc_skill_requirement_attribute (attr_id, value, npc_skill_requirement_id)
VALUES ((SELECT id FROM attribute WHERE short_name = 'atk'),
        120,
        (SELECT nsr.id FROM npc_skill_requirement nsr INNER JOIN npc_skill ns ON nsr.npc_skill_id = ns.id WHERE ns.name = 'mammonite'));

INSERT INTO npc_skill_target_stat_effect (stat_id, npc_skill_id, target_type_id, effect_type_id, effect_applied_as_id, value, duration)
VALUES ((SELECT id FROM stat WHERE short_name = 'luk'), 
        (SELECT id FROM npc_skill WHERE name = 'mammonite'),
        (SELECT id FROM target_type WHERE name = 'other'),
        (SELECT id FROM effect_type WHERE name = 'set'),
        (SELECT id FROM effect_applied_as WHERE name = 'flat'), 0, 20);

INSERT INTO npc_skill_target_attribute_effect (attr_id, npc_skill_id, target_type_id, effect_type_id, effect_applied_as_id, value, duration)
VALUES ((SELECT id FROM attribute WHERE short_name = 'eva'), 
        (SELECT id FROM npc_skill WHERE name = 'mammonite'),
        (SELECT id FROM target_type WHERE name = 'other'),
        (SELECT id FROM effect_type WHERE name = 'decrease'),
        (SELECT id FROM effect_applied_as WHERE name = 'percent'), 20, 20);
-- CREATE SKILL END