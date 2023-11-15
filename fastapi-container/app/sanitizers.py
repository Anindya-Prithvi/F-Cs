import bleach
from fastapi import HTTPException
import re


def sanitize(input_string):
    allowed_tags = []
    allowed_attrs = {}
    
    # remove HTML tags
    san_html = bleach.clean(input_string, tags=allowed_tags, attributes=allowed_attrs)
    return san_html

def name_sanitize(name):
    return name.isalpha()

def username_sanitize(name):
    return name.isalnum()

def is_valid_address(address):
    # This regex allows alphanumeric characters, spaces, and ',.-'
    pattern = r'^[a-zA-Z0-9\s,\.-]+$'
    if re.match(pattern, address):
        return True
    return False

def check_amenities(s):
    pattern = r'^[a-zA-Z]+( [a-zA-Z]+)*$'
    if re.match(pattern, s):
        return True
    else:
        return False

def enlist_search_sanitize(params: dict):
    new_params = {}
    for key, value in params.items():
        if key == "seller_username":
            if username_sanitize(value):
                new_params[key] = sanitize(value)
            else:
                raise HTTPException(417, "Invalid Username")

        if key == "address":
            if is_valid_address(value):
                new_params[key] = sanitize(value)
            else:
                raise HTTPException(417,"Address format is house_no.,street,city")
        
        if key == "bhk":
            if str(value).isnumeric():
                new_params[key] = value
            else:
                raise HTTPException(417,"BHK should be numeric")

        if key == "carpet_area":
            if str(int(value)).isnumeric():
                new_params[key] = value
            else:
                raise HTTPException(417,"carpet_area should be numeric")

        if key == "cost":
            if str(int(value)).isnumeric():
                new_params[key] = value
            else:
                raise HTTPException(417,"cost should be numeric")

        if key == "super_area":
            if str(int(value)).isnumeric():
                new_params[key] = value
            else:
                raise HTTPException(417,"super_area should be numeric")
        
        if key == "amenities":
            for i in value:
                if check_amenities(i):
                    new_params[key] = sanitize(i)
                else:
                    raise HTTPException(417,"Amenities should be space separated words with alphabets only")
        
        if key == "is_rent":
            new_params[key] = value
        
        if key == "is_sale":
            new_params[key] = value

        if key == "is_verified":
            new_params[key] = value

        if key == "contract_accepted":
            new_params[key] = value
                
    return new_params