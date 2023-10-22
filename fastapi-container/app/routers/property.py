from typing import Annotated, List

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from ..utils.clients import PROPERTY_LISTINGS_COLLECTION
from .login import User, get_current_active_user
import json


class PropertyDetails(BaseModel):
    seller_username: str
    address: str
    is_rent: bool
    is_sale: bool
    amenities: List[str]
    bhk: int  # BHK
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
async def add_property(
    property: PropertyDetails, _user: Annotated[User, Depends(get_current_active_user)]
):
    # TODO: can't create same property multiple times
    # TODO: LISTING ID !!!! 
    result = PROPERTY_LISTINGS_COLLECTION.insert_one(property.__dict__)
    return {"message": "Document created", "document_id": str(result)}


@router.get("/list_user_properties")
async def list_user_properties(user: Annotated[User, Depends(get_current_active_user)]):
    documents = PROPERTY_LISTINGS_COLLECTION.find({"seller_username": user.username})
    docs = []
    for document in documents:
        document["_id"] = str(document["_id"])
        docs.append(document)
    return {"documents": docs}


@router.post("/modify_property")
async def modify_property(
    id: str,
    property: PropertyDetails,
    user: Annotated[User, Depends(get_current_active_user)],
):  # username to verify
    query = {"seller_username": user.username, "_id": id}
    new_values = {
        "$set": {
            "address": property.address,
            "is_rent": property.is_rent,
            "is_sale": property.is_sale,
            "amenities": property.amenities,
            "bhk": property.bhk,
            "carpet_area": property.carpet_area,
            "super_area": property.super_area,
            "cost": property.cost,
        }
    }
    PROPERTY_LISTINGS_COLLECTION.update_one(query, new_values)


@router.get("/delete_property")
async def delete_properties(
    id: str, user: Annotated[User, Depends(get_current_active_user)]
):
    PROPERTY_LISTINGS_COLLECTION.remove({"_id": id, "seller_username": user.username})


@router.get("/search_properties")
async def search_properties(**params):
    p = eval(params["params"])
    
    results = []
    for x in PROPERTY_LISTINGS_COLLECTION.find(p):
        x["_id"] = str(x["_id"])
        results.append(x)
        
    return results
