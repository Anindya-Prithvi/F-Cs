from fastapi import FastAPI, Request, APIRouter
import time
import os

from ..utils.clients import PROPERTY_LISTINGS_COLLECTION
from .login import oauth2_scheme

from typing import Annotated
from fastapi import Depends

from typing import List
from pydantic import BaseModel


# property_verification: 
# {
# username
# file_blob,
# signature
# }

# property_listings: 
# {
# username:
# Address: 
# Type: rent/sale
# cost:
# OWNER_USERNAME:
# amenities:
# size: 
# }

class PropertyDetails(BaseModel):
    seller_username: str
    address: str
    is_rent: bool
    is_sale: bool
    amenities: List[str]
    bhk: int # BHK
    carpet_area: float
    super_area: float 
    cost: float

# class PropertyListing(BaseModel):
#     owner_username: str
#     property_details: PropertyDetails

# PROPERTies_DB -> username -> listed_props
# or add seller_username in property itself so that if a buyer wants to search seller after looking at property
# Search is easy and no need for listing then

router = APIRouter(prefix="/api/v1", tags=["property-api"])


@router.post("/add_property")
async def add_property(property: PropertyDetails):
    #to-do: can't create same property multiple times
    result = PROPERTY_LISTINGS_COLLECTION.insert_one(property.__dict__)
    return {"message": "Document created", "document_id": str(result)}

@router.get("/list_properties")
async def list_properties(username: str):
    documents = PROPERTY_LISTINGS_COLLECTION.find({"seller_username": username})
    docs = []
    for document in documents:
        docs.append(str(document))
    return {"documents": docs}

@router.post("/modify_property")
async def modify_properties(property: PropertyDetails): # username to verufy
    query = {"seller_username":property.seller_username}
    new_values = {"$set": { "address": property.address, "is_rent":property.is_rent, "is_sale":property.is_sale, 
                            "amenities": property.amenities, "bhk": property.bhk, "carpet_area":property.carpet_area,
                             "super_area":property.super_area, "cost":property.cost}}
    PROPERTY_LISTINGS_COLLECTION.update_one(query, new_values)

@router.get("/delete_property")
async def delete_properties(username: str, property_id: int): # username to verufy
    PROPERTY_LISTINGS_COLLECTION.remove({"_id": property_id, "seller_username": username})
