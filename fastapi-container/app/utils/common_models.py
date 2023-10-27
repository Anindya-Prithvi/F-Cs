from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    public_key_e: str
    public_key_n: str
    is_kyc: bool | None = False
    kyc_email: str = ""  # TODO: MAKE THIS UNIQUE
