from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..sanitizers import enlist_search_sanitize

from ..utils.clients import PROPERTY_LISTINGS_COLLECTION
from .login import User, get_current_active_user


from pprint import pprint
from app.routers.otp import user_has_2FA, verify_totp


from fastapi import UploadFile





import hmac
import hashlib
import os
from bson.objectid import ObjectId
from web3 import Web3


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
    is_verified: bool = False
    contract_accepted: bool = False



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
    if property.seller_username!=_user.username:
        raise HTTPException(400, "who are you")
    new_dict = enlist_search_sanitize(property.__dict__)
    result = PROPERTY_LISTINGS_COLLECTION.insert_one(new_dict)

    # this HMAC must be appended to the ledger for verification
    return {"message": "Document created", "property_id": str(result.inserted_id)}

@router.post("/add_property_document")
async def add_property_document(property_documents: UploadFile, property_id: str,  _user: Annotated[User, Depends(get_current_active_user)], otp: int | None = None):
    # Find the property with the given property_id
    # TODO: REQUIRE OTP
    if user_has_2FA(_user)["status"]:
        if otp==None:
            raise HTTPException(422, "No OTP provided, OK")
        verify_totp(otp, _user.username)

    
    property = PROPERTY_LISTINGS_COLLECTION.find_one({"_id": ObjectId(property_id)})
    if not property:
        raise HTTPException(404, "Property not found")
    
    # Add the property document to the same collection as property
    document = {
        "property_id": property_id,
        "document": property_documents.file.read(),
        "document_name": property_documents.filename,
        "document_content_type": property_documents.content_type,
        "uploaded_by": _user.username
    }


    PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(property_id), "seller_username": _user.username}, {"$push": {"documents": document}})

    property = PROPERTY_LISTINGS_COLLECTION.find_one({"_id": ObjectId(property_id)})
    
    hk = os.getenv("HMAC_KEY").encode("utf-8")
    property_hmac = hmac.new(hk, str(property).encode(), hashlib.sha256).hexdigest()

    PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(property_id), "seller_username": _user.username}, {"$push": {"hmac": property_hmac}})

    return {"message": "Property document added successfully", "hmac": property_hmac}




@router.post("/verify_property")
async def verify_single_listing(_user: Annotated[User, Depends(get_current_active_user)], property_id: str):

    is_verified = PROPERTY_LISTINGS_COLLECTION.find_one({"_id": ObjectId(property_id)}).get("is_verified")

    # if is_verified == None:
    #     print("NONOE")
    #     return {"message": "Not verified"}
    
    if is_verified == True:
        return {"message": "Verified"}
    
    if verify_property(property_id):
        return {"message": "Verified"}

    print("WHTATTTA")
    return {"message": "Not verified"}


@router.post("/contract_accepted")
async def contract_accepted(_user: Annotated[User, Depends(get_current_active_user)], property_id: str):
    PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(property_id)}, {"$set": {"contract_accepted": True}})
    return {"message": "Contract accepted"}


#   property.owner,
#   property.price,
#   property.given_to,
#   property.hmac

def verify_property(property_id: str) -> bool:
    w3 = Web3(Web3.HTTPProvider('https://goerli.infura.io/v3/e4201a80a7014f1590572e08df3a306a'))

    print(w3)

    # Contract ABI
    abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "doc_id",
                "type": "string"
            }
        ],
        "name": "buyProperty",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "doc_id",
                "type": "string"
            }
        ],
        "name": "delete_property",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "doc_id",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_hmac",
                "type": "uint256"
            }
        ],
        "name": "editProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_hmac",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_doc_id",
                "type": "string"
            }
        ],
        "name": "enlistProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "doc_id",
                "type": "string"
            }
        ],
        "name": "getProperty",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "properties",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "given_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "hmac",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "doc_id",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
    # Contract address
    contract_address = "0xe35FE337fE0B637d0449fa733A0627255D07FCF8"

    # Connect to contract
    contract = w3.eth.contract(address=contract_address, abi=abi)
    print(contract)

    # property_id = "6554a097db676dc26ac5e232"

    owner_address, price, given_to_address, hmac = contract.functions.getProperty(property_id).call()

    print(owner_address, price, given_to_address, hmac)

    database_hmac = int(PROPERTY_LISTINGS_COLLECTION.find_one({"_id": ObjectId(property_id)}).get("hmac")[0], 16)

    print("block hmac", hmac)
    print("data hmac", database_hmac)

    if hmac == database_hmac:
        PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(property_id)}, {"$set": {"is_verified": True}})
        return True
    
    PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(property_id)}, {"$set": {"is_verified": False}})
    return False



@router.get("/list_user_properties")
async def list_user_properties(user: Annotated[User, Depends(get_current_active_user)]):
    documents = PROPERTY_LISTINGS_COLLECTION.find({"seller_username": user.username})
    docs = []
    for document in documents:
        document["_id"] = str(document["_id"])
        if document.get("is_verified") == False:
            document["is_verified"] = verify_property(document["_id"])
            PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(document["_id"])}, {"$set": {"is_verified": document["is_verified"]}})
        if document.get("is_verified") == None:
            document["is_verified"] = False
        
        print(document["is_verified"])

    
        docs.append(document)
    return {"documents": docs}


@router.get("/list_properties")
async def list_properties(user: Annotated[User, Depends(get_current_active_user)]):
    documents = PROPERTY_LISTINGS_COLLECTION.find({})
    docs = []
    for document in documents:
        document["_id"] = str(document["_id"])
        if document.get("is_verified") == False:
            document["is_verified"] = verify_property(document["_id"])
            if document["_id"] == "6554ecd68c7a06a8484bbd1e":
                print("Hello", document["is_verified"], document["_id"])
            PROPERTY_LISTINGS_COLLECTION.update_one({"_id": ObjectId(document["_id"])}, {"$set": {"is_verified": document["is_verified"]}})
        if document.get("is_verified") == None:
            document["is_verified"] = False

        if document.get("contract_accepted") == None:
            document["contract_accepted"] = False
        
        # print(document["is_verified"])

    
        docs.append(document)
    return {"documents": docs}



@router.post("/modify_property")
async def modify_property(
    id: str,
    property: PropertyDetails,
    user: Annotated[User, Depends(get_current_active_user)],
):  # username to verify
    query = {"seller_username": user.username, "_id": ObjectId(id)}
    new_dict = enlist_search_sanitize(property.__dict__)
    new_values = {
        "$set": {
            "address": new_dict["address"],
            "is_rent": property.is_rent,
            "is_sale": property.is_sale,
            "amenities": new_dict["amenities"],
            "bhk": new_dict["bhk"],
            "carpet_area": new_dict["carpet_area"],
            "super_area": new_dict["super_area"],
            "cost": new_dict["cost"],
        }
    }
    result = PROPERTY_LISTINGS_COLLECTION.update_one(query, new_values)
    return {"message": "Document updated", "matched_count": result.matched_count}


@router.get("/delete_property")
async def delete_property(
    property_id: str, user: Annotated[User, Depends(get_current_active_user)]
):
    
    query = {"seller_username": user.username, "_id": ObjectId(property_id)}
    result = PROPERTY_LISTINGS_COLLECTION.delete_one(query)

    if result.deleted_count == 0:
        raise HTTPException(404, "Property not found")

    return {"message": "Property deleted", "deleted_count": result.deleted_count}


@router.post("/search_properties")
async def search_properties(params: dict):
    # TODO: Add sanitization
    params = enlist_search_sanitize(params)
    results = []
    for x in PROPERTY_LISTINGS_COLLECTION.find(params):
        x["_id"] = str(x["_id"])
        results.append(x)

    return results
