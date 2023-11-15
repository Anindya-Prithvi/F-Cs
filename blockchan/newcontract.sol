// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <0.9.0;

contract PropertyListing {
    struct Property {
        address owner;
        uint256 price;
        address given_to;
        uint256 hmac;
        string doc_id;
    }

    mapping(string => Property) public properties;

    function enlistProperty(
        uint256 _price,
        uint256 _hmac,
        string memory _doc_id
    ) public {
        Property memory newProperty = Property({
            owner: msg.sender,
            price: _price,
            given_to: msg.sender,
            hmac: _hmac,
            doc_id: _doc_id
        });
        require(properties[_doc_id].owner == address(0), "A property with this ID already exists");
        properties[_doc_id] = newProperty;
    }

    function editProperty(
        string memory doc_id,
        uint256 _price,
        uint256 _hmac
    ) public {

        Property storage property = properties[doc_id];
        require(property.given_to == msg.sender, "Property already sold");

        property.price = _price;
        property.hmac = _hmac;
    }

    function getProperty(string memory doc_id)
        public
        view
        returns (
            address,
            uint256,
            address,
            uint256
        )
    {

      Property memory property = properties[doc_id];
      return (
          property.owner,
          property.price,
          property.given_to,
          property.hmac
      );
    }

    function delete_property(string memory doc_id) public {
        delete properties[doc_id];
    }

    function buyProperty(string memory doc_id) public payable {

        Property storage property = properties[doc_id];

        require(property.given_to == property.owner, "Property already sold");
        require(msg.value >= property.price, "Not enough Ether provided");

        payable(property.owner).transfer(msg.value);

        property.given_to = msg.sender;
    }
}

