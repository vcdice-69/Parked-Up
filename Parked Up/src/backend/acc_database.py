import sqlite3
import re

dbpath = "./acc_database.db"

def execute_dml(query, data):
    """for manipulation of data (e.g. insert, delete)"""
    with sqlite3.connect(dbpath) as conn:
        c = conn.cursor()

        c.execute(query, data)

        conn.commit()

def execute_dql(query, data):
    """getting data (e.g. read/display)"""
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
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

    if(re.fullmatch(regex, email)):
        return True

    else:
        return False
    
def check_phone_no(phone_no: str):
    phone_no = phone_no.replace(" ", "")
    
    if (phone_no.isdigit()) and (len(phone_no) == 8):
        return True
    else:
        return False
    
def check_password(password):
    """
    Conditions:
    -Minimum 8 characters.
    -The alphabet must be between [a-z]
    -At least one alphabet should be of Upper Case [A-Z]
    -At least 1 number or digit between [0-9].
    -At least 1 symbol.
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
    """finds account by email, returns account info as a dictionary. if none, returns None"""
    find_acc = '''
                SELECT * FROM "Accounts"

                WHERE "Accounts"."email" = ?;
                '''
    
    result = execute_dql(find_acc, (email,))
    if result and isinstance(result, list) and len(result) > 0:
        return result[0]  # Return the first (and ideally only) record from the list
    return None

def new_acc(username, email, phone_no, password):
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
    email: email that account is registered under
    new_record: dict containing ALL updated details (username, email, phone_no, password)
    """
    # Check if the account exists
    if find_acc(acc_email) is None:
        print("Account does not exist")
        return False

    new_email = new_record["email"]
    phone_no = new_record["phone_no"]
    password = new_record["password"]

    if check_email(new_email) and check_phone_no(phone_no) and check_password(password):
        try:
            # Update Accounts table
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

            # If email has changed, update the Favourites table
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
    """Update all favourite records to reflect the new email"""
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
    """Delete all favourited carparks of a user"""
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
    """Delete user account and their favourites"""
    if find_acc(email) is None:
        return False

    try:
        # First, delete all their favourite carparks
        delete_all_favs(email)

        # Then delete the account
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
    try:
        get_all_favs = '''
                        SELECT * FROM "Favourites"
                        WHERE "Favourites"."user_email" = ?;
                        '''
        result = execute_dql(get_all_favs, (email,))
        print("DEBUG: Result:", result)

        if result is None:
            return None
        else:
            fav_list = []
            for fav_record in result:
                print("DEBUG: fav_record:", fav_record)
                fav_list.append(fav_record["carpark_no"])
            return fav_list

    except Exception as e:
        print(e)

# part 1 (insert)
# new_acc("dora", "dora@gmail.com", "11111111", "DoraPW@123")
# new_acc("yuhe", "yuhe@gmail.com", "22222222", "YuhePW@123")
# new_acc("ethan", "ethan@gmail.com", "33333333", "EthanPW@123")
# new_acc("marvin", "marvin@gmail.com", "44444444", "MarvinPW@123")

# part 2 (delete)
# print(find_acc("yuhe@gmail.com"))
# print(delete_acc("yuhe@gmail.com"))
# print(find_acc("yuhe@gmail.com"))

# part 3 (login)
# print(login("ethan@gmail.com", "EthanPW@123"))
# print(login("ethan@gmail.com", "EthanPW@1234"))

# part 4 (update)
# updated_rec = {"username": "dora2",
#                "email": "dora2@gmail.com",
#                "phone_no": "12121212",
#                "password": "DoraPW2@123"}

# update_details("dora@gmail.com", updated_rec)
# print(find_acc("dora2@gmail.com"))

# part 5 (add fav)
# add_fav("marvin@gmail.com", "ABC")
# add_fav("marvin@gmail.com", "123")
# add_fav("marvin@gmail.com", "ABC123")

# part 6 (delete fav)
# delete_fav("toto@gmail.com", "")

# part 7 (get all favs)
# print(get_all_favs("marvin@gmail.com"))