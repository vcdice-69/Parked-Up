import sqlite3
import re

dbpath = "./acc_database.db"

def execute_dml(query, data):
    """helper function for manipulation of data (e.g. insert, delete)"""
    with sqlite3.connect(dbpath) as conn:
        c = conn.cursor()

        c.execute(query, data)

        conn.commit()

def execute_dql(query, data):
    """helper function for obtaining data (e.g. read/display)
    Returns: list[dict]"""
    with sqlite3.connect(dbpath) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        c.execute(query, data)
        result = c.fetchall()

    if result:
        # Ensure result is converted to a list of dictionaries
        return [dict(row) for row in result]
    else:
        return None

    
def check_email(email):
    """
    Checks if email is in valid format.
    Conditions:
    -valid chars before "@"
    -contains "@"
    -valid chars between "@" and "."
    -contains "."
    -at least 2 chars after "."

    Parameters: 
    -email: str

    Returns:
    -Boolean
    """
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

    if(re.fullmatch(regex, email)):
        return True

    else:
        return False
    
def check_phone_no(phone_no: str):
    """
    Checks if phone number is valid.
    Conditions:
    -8 digits

    Parameters: 
    -phone_no: str

    Returns:
    -Boolean
    """
    phone_no = phone_no.replace(" ", "")
    
    if (phone_no.isdigit()) and (len(phone_no) == 8):
        return True
    else:
        return False
    
def check_password(password):
    """
    Checks if password is strong.
    Conditions:
    -Minimum 8 characters.
    -At least 1 alphabet should be of Upper Case [A-Z]
    -At least 1 number or digit between [0-9].
    -At least 1 symbol.

    Parameters:
    -password: str

    Returns:
    -Boolean
    """
    symbols = "~`!@#$%^&*()_-+={[}]|:;'<,>.?/"
    lower, upper, symbol, number = 0, 0, 0, 0
    if (len(password) >= 8):
        for i in password:
            # counting lowercase alphabets 
            if (i.islower()):
                lower+=1            

            # counting uppercase alphabets
            if (i.isupper()):
                upper+=1            

            # counting digits
            if (i.isdigit()):
                number+=1            

            # counting the mentioned special characters
            if i in symbols:
                symbol+=1

    if (lower>=1 and upper>=1 and symbol>=1 and number>=1 and lower+symbol+upper+number==len(password)):
        return True
    else:
        return False

def find_acc(email):
    """
    Finds account by email, and returns the account information as a dictionary. 
    Returns None if no results are found.
    
    Parameters:
    -email: str

    Returns:
    -dict
    """
    find_acc = '''
                SELECT * FROM "Accounts"

                WHERE "Accounts"."email" = ?;
                '''
    
    result = execute_dql(find_acc, (email,))
    if result and isinstance(result, list) and len(result) > 0:
        return result[0]  # Return the first (and ideally only) record from the list
    return None

def new_acc(username, email, phone_no, password):
    """
    Adds a new account into the database. 
    Returns True if the new account is successfully added, else returns False.
    
    Parameters:
    -username: str
    -email: str
    -phone_no: str
    -password: str

    Returns:
    -Boolean
    """
    # check if updated fields are valid
    valid_email = check_email(email)
    valid_number = check_phone_no(phone_no)
    valid_pw = check_password(password)

    if valid_email and valid_number and valid_pw:
        try:
            acc_details = {"username":username,
                        "email":email,
                        "phone_no":phone_no,
                        "password":password}

            new_acc = '''
                    INSERT INTO "Accounts" (
                    "username",
                    "email",
                    "phone_no",
                    "password"
                    ) VALUES (
                    :username, :email, :phone_no, :password)
                    '''

            execute_dml(new_acc, acc_details)
            return True

        except Exception as e:
            print(e)
    
    else:
        return False

def login(email, password):
    """
    Checks login credentials match information in database.
    Returns True if login is successful, else returns False.

    Parameters:
    -email: str
    -password: str

    Returns:
    -Boolean
    """
    acc_details = find_acc(email)
    # acc does not exist
    if acc_details is None:
        return False
    
    if password == acc_details["password"]:
        return True
    else:
        return False


def update_details(acc_email, new_record):
    """
    Updates account details in database.
    Retrieves record using the email that account is currently registered under.
    new_record requires ALL fields (ie. username, email, phone_no, password)to be passed in, regardless of whether it was updated.
    Returns True if update is successful, else returns False.
    
    Parameters:
    -email: str
    -new_record: dict 
    """
    # check if the account exists
    if find_acc(acc_email) is None:
        print("Account does not exist")
        return False

    new_email = new_record["email"]
    phone_no = new_record["phone_no"]
    password = new_record["password"]

    if check_email(new_email) and check_phone_no(phone_no) and check_password(password):
        try:
            # update Accounts table
            update = '''
                UPDATE "Accounts" SET
                "username" = ?,
                "email" = ?,
                "phone_no" = ?,
                "password" = ?
                WHERE "email" = ?
            '''

            data = (
                new_record["username"],
                new_email,
                phone_no,
                password,
                acc_email
            )
            
            execute_dml(update, data)

            # if email has changed, update the Favourites table
            if acc_email != new_email:
                update_fav_email(acc_email, new_email)

            print(f"User with email {acc_email} updated successfully.")
            return True
        
        except Exception as e:
            print(f"Error during update: {e}")
            return False
    else:
        print("Invalid email/phone number/password")
        return False

def update_fav_email(old_email, new_email):
    """
    Updates all favourite records to reflect the new email.
    Returns True if update is successful, else returns False.

    Parameters:
    -old_email: str
    -new_email: str

    Returns:
    -Boolean
    """
    try:
        update_fav = '''
            UPDATE "Favourites"
            SET "user_email" = ?
            WHERE "user_email" = ?
        '''

        execute_dml(update_fav, (new_email, old_email))
        print(f"Favourites updated from {old_email} to {new_email}")
        return True
    
    except Exception as e:
        print(f"Error updating favourites: {e}")
        return False


def delete_all_favs(email):
    """
    Deletes all favourited carparks of a user from the database.
    Returns True if deletion is successful, else returns False.

    Parameters:
    -email: str

    Returns:
    -Boolean
    """
    try:
        query = '''
                DELETE FROM "Favourites"
                WHERE "user_email" = ?;
                '''
        
        execute_dml(query, (email,))
        return True
    
    except Exception as e:
        print(e)
        return False

def delete_acc(email):
    """
    Deletes user account and their favourites from the database.
    Returns True if deletion is successful, else returns False.

    Parameters:
    -email: str

    Returns:
    -Boolean
    """
    # acc does not exist
    if find_acc(email) is None:
        return False

    try:
        # delete all their favourite carparks first
        delete_all_favs(email)

        # then delete their account
        query = '''
                DELETE FROM "Accounts"
                WHERE "email" = ?;
                '''
        
        execute_dml(query, (email,))
        return True
    
    except Exception as e:
        print(e)
        return False


def add_fav(email, carpark_no):
    """
    Adds a user's favourite carpark to the database.
    Returns True if favourite carpark is successfully added, else returns False.

    Parameters:
    -email: str
    -carpark_no: str

    Returns:
    -Boolean
    """
    try:
        fav_dict = {"user_email": email, "carpark_no": carpark_no}

        add_fav = '''
                INSERT INTO "Favourites" (
                "user_email",
                "carpark_no"
                ) VALUES (
                :user_email, :carpark_no)
                '''
        
        execute_dml(add_fav, fav_dict)
        return True

    except Exception as e:
        print(e)

def delete_fav(email, carpark_no):
    """
    Deletes a user's favourite carpark from the database.
    Returns True if favourited carpark is successfully deleted, else returns False.

    Parameters:
    -email: str
    -carpark_no: str

    Returns:
    -Boolean
    """
    try:
        delete_fav = '''
                    DELETE FROM "Favourites"
                    WHERE "user_email" = ?
                    AND "carpark_no" = ?;
                    '''
        
        execute_dml(delete_fav, (email, carpark_no))
        return True
    
    except Exception as e:
        print(e)

def get_all_favs(email):
    """
    Retrieves all of the user's favourite carparks.
    Returns a list of all the carpark numbers.
    Returns None if no carparks are favourited.

    Parameters:
    -email: str

    Returns:
    -fav_list: list
    """
    try:
        get_all_favs = '''
                        SELECT * FROM "Favourites"
                        WHERE "Favourites"."user_email" = ?;
                        '''
        result = execute_dql(get_all_favs, (email,))

        if result is None:
            return None
        
        else:
            fav_list = []
            for fav_record in result:
                fav_list.append(fav_record["carpark_no"])

            return fav_list

    except Exception as e:
<<<<<<< HEAD
        print(e)
=======
        print(e)