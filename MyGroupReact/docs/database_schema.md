# My Group Database Schema Documentation

## Database Information
- **Database Name**: my_group
- **Database Type**: MySQL
- **Character Set**: utf8
- **Collation**: utf8_general_ci

## Core Tables

### 1. Authentication & User Management

#### users (Ion Auth)
- **id** (Primary Key)
- **username** (Unique)
- **password** (Hashed)
- **email** (Unique)
- **first_name**
- **last_name**
- **company**
- **phone**
- **profile_img**
- **display_name**
- **alter_number** (Alternative phone number)
- **created_on**
- **last_login**
- **active**

#### groups (Ion Auth)
- **id** (Primary Key)
- **name**
- **description**

#### users_groups (Ion Auth Junction Table)
- **id** (Primary Key)
- **user_id** (Foreign Key → users.id)
- **group_id** (Foreign Key → groups.id)

#### login_attempts (Ion Auth)
- **id** (Primary Key)
- **ip_address**
- **login**
- **time**

#### user_registration_form
- **id** (Primary Key)
- **user_id** (Foreign Key → users.id)
- **country_flag**
- **country_code**
- **gender**
- **dob** (Date of Birth)
- **country** (Foreign Key → country_tbl.id)
- **state** (Foreign Key → state_tbl.id)
- **district** (Foreign Key → district_tbl.id)
- **education** (Foreign Key → education.id)
- **profession** (Foreign Key → profession.id)
- **education_others**
- **work_others**
- **dob_date**
- **dob_month**
- **dob_year**
- **country_flag_alter**

### 2. Geographic Data

#### continent_tbl
- **id** (Primary Key)
- **continent**

#### country_tbl
- **id** (Primary Key)
- **continent_id** (Foreign Key → continent_tbl.id)
- **country**
- **order**
- **status**
- **code**
- **currency**
- **country_flag**
- **phone_code**
- **nationality**

#### state_tbl
- **id** (Primary Key)
- **country_id** (Foreign Key → country_tbl.id)
- **state**
- **order**
- **status**
- **code**

#### district_tbl
- **id** (Primary Key)
- **state_id** (Foreign Key → state_tbl.id)
- **district**
- **order**
- **status**
- **code**

### 3. Group Management

#### group_create
- **id** (Primary Key)
- **name**
- **apps_name**
- **db_name**

#### create_details
- **id** (Primary Key)
- **create_id** (Foreign Key → group_create.id)
- **icon**
- **logo**
- **name_image**
- **background_color**
- **banner**
- **url**

#### group
- **id** (Primary Key)
- **logo**
- **header_slider**
- **other_config_fields**

### 4. Advertising System

#### aderttise
- **id** (Primary Key)
- **create_id** (Foreign Key → group_create.id)
- **ads1**
- **ads2**
- **ads3**
- **ads1_url**
- **ads2_url**
- **ads3_url**

#### main_ads
- **id** (Primary Key)
- **ads1**
- **ads2**
- **ads3**
- **ads1_url**
- **ads2_url**
- **ads3_url**

#### popup_ads
- **id** (Primary Key)
- **side_ads**
- **side_ads_url**
- **side_seconds**

### 5. Labor Management

#### labor_profile
- **id** (Primary Key)
- **labor_name**
- **father_husband_name**
- **mobile_number**
- **from_date**
- **from_month**
- **from_year**
- **location_country** (Foreign Key → country_tbl.id)
- **location_state** (Foreign Key → state_tbl.id)
- **location_district** (Foreign Key → district_tbl.id)
- **address_line1**
- **address_line2**
- **address_pincode**

#### labor_account
- **id** (Primary Key)
- **labor_name**
- **labor_mobile_number**
- **labor_designation**
- **account_details** (JSON)

### 6. Needy Services

#### needy_category
- **id** (Primary Key)
- **category**
- **group_id** (Foreign Key → group_create.id)
- **needy_type**

#### needy_client_services_details
- **id** (Primary Key)
- **group_id** (Foreign Key → group_create.id)
- **type**
- **user_id** (Foreign Key → users.id)
- **status**
- **country** (Foreign Key → country_tbl.id)
- **state** (Foreign Key → state_tbl.id)
- **district** (Foreign Key → district_tbl.id)
- **needy_category** (Foreign Key → needy_category.id)
- **consultancy_charges_from**
- **consultancy_charges_to**
- **address**
- **area**
- **pincode**
- **descriptions**
- **services_name**
- **name_regional_language**
- **contact_number**
- **photo**

#### needy_client_services_time_details
- **id** (Primary Key)
- **needy_client_services_id** (Foreign Key → needy_client_services_details.id)
- **time_details**

#### needy_client_services_review
- **id** (Primary Key)
- **needy_client_services_id** (Foreign Key → needy_client_services_details.id)
- **user_id** (Foreign Key → users.id)
- **review_text**
- **rating**

### 7. Reference Data

#### language
- **id** (Primary Key)
- **language**

#### education
- **id** (Primary Key)
- **education**

#### profession
- **id** (Primary Key)
- **profession**

### 8. Additional Tables (Identified from Models)

#### feedback_suggetions
- **id** (Primary Key)
- **user_id** (Foreign Key → users.id)
- **replyed_by** (Foreign Key → users.id)
- **status**
- **date**

#### union_validity
- **id** (Primary Key)
- **client_user_id** (Foreign Key → users.id)
- **validity_details**

#### member_registration
- **id** (Primary Key)
- **client_user_id** (Foreign Key → users.id)
- **status**

#### union_staff_registration
- **id** (Primary Key)
- **client_user_id** (Foreign Key → users.id)
- **union_location_state**
- **union_location_district**
- **photo**

#### media_category
- **id** (Primary Key)
- **category**
- **group_id** (Foreign Key → group_create.id)
- **media_type**

#### mytv_public
- **id** (Primary Key)
- **content_details**

#### mytv_public_img
- **id** (Primary Key)
- **mytv_public_id** (Foreign Key → mytv_public.id)
- **image**

#### myunions_category
- **id** (Primary Key)
- **unions_type**

#### group_sub_category
- **id** (Primary Key)
- **group_name**
- **category_id**
- **sub_category**
- **category_type**

#### group_sub_sub_category
- **id** (Primary Key)
- **group_name**
- **category_id**
- **sub_category_id**
- **sub_sub_category**
- **category_type**

#### about
- **id** (Primary Key)
- **group_id** (Foreign Key → group_create.id)
- **content**

#### contact
- **id** (Primary Key)
- **address**
- **email**
- **contact_number**
- **group_id** (Foreign Key → group_create.id)

#### copy_rights
- **id** (Primary Key)
- **content**

#### apply_now
- **id** (Primary Key)
- **application_details**

## Key Relationships

1. **Users → User Registration Form**: One-to-One
2. **Users → Geographic Data**: Many-to-One (country, state, district)
3. **Group Create → Create Details**: One-to-One
4. **Group Create → Advertisements**: One-to-One
5. **Needy Services → Users**: Many-to-One
6. **Needy Services → Geographic Data**: Many-to-One
7. **Labor Profile → Geographic Data**: Many-to-One
8. **Geographic Hierarchy**: Continent → Country → State → District

## Notes
- The system uses Ion Auth for authentication
- Geographic data is hierarchical (Continent > Country > State > District)
- Groups can have multiple categories and sub-categories
- The system supports multiple types of services (Needy, Labor, Media, etc.)
- File uploads are stored in the uploads directory with references in database
