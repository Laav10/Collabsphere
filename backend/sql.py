from sqlalchemy import create_engine,text
import psycopg2
from flask import Flask, request, jsonify
import binascii


engine = create_engine('postgresql+psycopg2://postgres:Karn1234@localhost:5432/postgres', echo=True)

from Crypto.Cipher import AES
import os
import base64

def encrypt_message(message, secret_key):
    cipher = AES.new(secret_key, AES.MODE_GCM)  # Use AES-GCM mode
    nonce = cipher.nonce  # Generate a unique nonce for each encryption
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())  # Encrypt + Authentication Tag

    return base64.b64encode(nonce + tag + ciphertext).decode()

def decrypt_message(encrypted_message, secret_key):
    data = base64.b64decode(encrypted_message)
    nonce, tag, ciphertext = data[:16], data[16:32], data[32:]

    cipher = AES.new(secret_key, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag).decode()
def  insert_message(message):
 with engine.connect() as conn:
     aes_key = binascii.unhexlify("f3a1c4e72d7b6a8fcb4d9912e5a8c37e4b9f02c6d78e5f1a9c3bdf8a45e7d203")

     print(message)
     encrypted_msg = encrypt_message(message['message'], aes_key)
     conn.execute(text("""
    INSERT INTO messages (username, usergroup, message,type,file_name) 
    VALUES 
    (:val1, :val2, :val3,:val4,:val5)"""),
   { "val1":message['username'],
    "val2":"general",
    "val3":encrypted_msg,
    "val4":message['type'],
    "val5":message['fileName']})
     conn.commit()

     decrypt_message(encrypted_msg, aes_key)
     print(decrypt_message(encrypted_msg, aes_key), "decrypted")



def  fetch_message(message):
 with engine.connect() as conn:
    
     conn.execute(text("""
  select * from messages where username=:val1



    """),{
  
  "val1":message['username']


     })
     conn.commit()

def add_projects(data):
   with engine.connect() as conn:
       # check whether with same admin same name other project exist
       result=conn.execute(text("""select * from "Project" where admin_id=:val1 and title=:val2"""),{
          
          "val1":data['admin_id'],
          "val2":data['title']})
       
       conn.commit()
   if(result.rowcount>0):
         print(result)  
           ### return can't be inserted change project name
         return jsonify({"project":"already exist"}), 401
   
   else:
      with engine.connect() as conn:
       # check whether with same admin same name other project exist
       try:
        result=conn.execute(text("""INSERT INTO "Project"
(admin_id, title, description, start_date, end_date, members_required, status, tags)
                                values
            (:val1,:val2,:val3,:val4,:val5,:val6,:val7,:val8)"""),{
          
          "val1":data['admin_id'],
          "val2":data['title'],
          "val3":data['description'],
          "val4":data['start_date'],
          "val5":data['end_date'],
         "val6":data['members_required'],
         "val7":data['status'],
         "val8":data['tags']
          
          })
        conn.commit()
        return jsonify({"project":"added"})


       

       except Exception as e: 
         return jsonify({"error": str(e)}), 500 
def ranking():
    with engine.connect() as conn:
        result=conn.execute(text("""SELECT 
    p.project_id, 
    p.title, 
    AVG(r.rating_value)*0.7+0.3 * COUNT(r.review) AS score
    FROM 
    Rating r
    JOIN 
    "Project" p ON r.project_id = p.project_id
    GROUP BY  
    p.project_id, 
    p.title
    ORDER BY 
    score DESC;
    """))
        conn.commit()
        
        rows=result.fetchall()
       
        data = [
    {"project_id": row[0], "title": row[1], "score": row[2]}
    for row in rows
]
        
        print(data)
        return jsonify({"project": data})
def first_logins(data):
       with engine.connect() as conn:
           try:
            result=conn.execute(text("""select * from "User" where roll_no=:val1"""),{
               "val1":data.get('roll_no')})
    
            conn.commit()
            if(result.rowcount>0):
               return jsonify ({"user":True})
            else:
             return jsonify ({"user":False}) 
           except Exception as e:
               return jsonify({"error": str(e)}), 500

def profile_views(data):
    #user profile view
    with engine.connect() as conn:
        try:
          result=conn.execute(text("""select * from "User" where roll_no=:val1"""),{
             
              "val1":data.get('roll_no')})
             
          conn.commit()
          rows=result.fetchall()
          data = [
    {
        "roll_no": row[0],  
        "email": row[1],  
        "past_experience": row[2],  
        "tech_stack": row[3],  
        "github_profile": row[4],  
        "linkedin_profile": row[5],  
        "role_type": row[6],  
        "rating": row[7]  ,
        "email_update": row[8],
        "project_update": row[9]
    }
    for row in rows
]
          if(result.rowcount==0):
              return jsonify({"user":False})
          else:
           return jsonify({"user": data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

def update_profile_sql(data):
   with engine.connect() as conn:
        try:
            query = text("""
        UPDATE "User"
        SET 
            
            past_experience = :past_experience,
            tech_stack = :tech_stack,
            github_profile = :github_profile,
            linkedin_profile = :linkedin_profile,
            role_type = :role_type,
            rating = :rating,
            email_update = :email_update,
            project_update = :project_update
        WHERE roll_no = :roll_no
    """)

            conn.execute(query, {
        
        "past_experience": data["past_experience"],
        "tech_stack": data["tech_stack"],
        "github_profile": data["github_profile"],
        "linkedin_profile": data["linkedin_profile"],
        "role_type": data["role_type"],
        "rating": data["rating"],
        "email_update": data["email_update"],
        "project_update": data["project_update"],
        "roll_no": data["roll_no"]
    })

            conn.commit()
            return jsonify({"profile":"updated"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

def list_of_mentors_sql(data):
   #list of mentors  # addxtaus of reject applied pending
   ##first check whether project  has mentor or not.
   result0=conn.execute(text("""select * from "projectmembers" where project_id=:val1 and role=:val2"""),{
      


        "val1":data['project_id'],
        "val2":"mentor"
   })
   if result0.rowcount>0:
        return jsonify({"mentor":"already exist"})
   else:
     project_id=data['project_id']
     with engine.connect() as conn:
      try:
        # return   in it the alumini professr to whom he applied status
         query = text("""
    SELECT 
        u.*, 
        COALESCE(m.status, 'Apply') AS status  
    FROM "User" u
    LEFT JOIN mentorrequest m 
        ON u.roll_no = m.mentor_id 
        AND m.status = 'Pending'
        AND m.project_id = :project_id  -- Filter for a specific project
    WHERE u.role_type IN ('professor', 'alumni');
""")

         result = conn.execute(query, {"project_id": project_id})
         conn.commit()
         rows=result.fetchall()
         data = [
    {   
        "roll_no": row[0],  
        "email": row[1],  
        "past_experience": row[2],  
        "tech_stack": row[3],  
        "github_profile": row[4],  
        "linkedin_profile": row[5],  
        "role_type": row[6],  
        "rating": row[7]  ,
        "name":row[8],
        "status": row[9]
      
    }
        for row in rows
]
         return jsonify({"mentor":data})
      except Exception as e:
          return jsonify({"error": str(e)}), 500

def apply_mentors_sql(data):
   #apply for mentor
   with engine.connect() as conn:
      try:
          result=conn.execute(text("""INSERT INTO "MentorRequest" (project_id, admin_id, mentor_id, status, requested_at, remarks)  
VALUES (:val1, :val2, :val3, :val4, :val5, :val6);
 """),{
    "val1":data['project_id'],
    "val2":data['admin_id'],
    "val3":data['mentor_id'],
    "val4":data['status'],
    "val5":data['requested_at'],
    "val6":data['remarks']
 })
          conn.commit()
          return jsonify({"mentor":"applied"})
      except Exception as e:
      
       return jsonify({"error": str(e)}), 500

def apply_mentors_takeback_sql(data):
    with engine.connect() as conn:
        try:
            result=conn.execute(text("""DELETE FROM "MentorRequest" WHERE mentor_id = :val1 AND project_id = :val2;"""),{
              "val1":data["mentor_id"],
              "val2":data["project_id"]
    
            })
            conn.commit()
            return jsonify({"request":"taken"})
        except Exception as e:
             return jsonify({"error": str(e)}), 500
      

def apply_project_sql(data):
   
   #apply for role in project
   with engine.connect() as conn:
      try:
         result=conn.execute(text("""Insert into "projectapplication" (user_id,project_id,role,remarks)
    VALUES(:val1,:val2,:val3,:val4);"""),{
       "val1":data['user_id'],
       "val2":data['project_id'],
        "val3":data['role'],
        "val4":data['remarks']





         })
         conn.commit()
         return jsonify({"project":"applied"})
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      
      
def apply_project_status_takeback_sql(data):
   
   with engine.connect() as conn:
      try:
         result=conn.execute(text("""DELETE FROM "projectapplication" WHERE user_id = :val1 AND project_id = :val2;"""),{
           "val1":data["user_id"],
           "val2":data["project_id"]

         })
         print(data["user_id"],data["project_id"])
         conn.commit()
         return jsonify({"request":"taken"})
      except Exception as e:
          return jsonify({"error": str(e)}), 500
         


def apply_project_status_sql(data):
   with engine.connect() as conn:
      try:
          #for single project and a user application status
         result=conn.execute(text("""select * from "projectapplication" where user_id=:val1 and project_id=:val2"""),{
       "val1":data['user_id'],
       "val2":data['project_id']


         })
         conn.commit()
         rows=result.fetchall()
         data = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]

         return jsonify({"project_status":data})
      
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      

      

def list_apply_project_sql(data):
   # for single project how many people applied
   with engine.connect() as conn:
        try:
          result=conn.execute(text("""select * from "projectapplication" where project_id=:val1"""),{
              "val1":data['project_id']
          })

          rows=result.fetchall()
          data = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]
          return jsonify({"project_list":data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500
def update_project_status_sql(data):

    # update /apply/takeback project applied
    with engine.connect() as conn:
      try:
         result = conn.execute(text("""
                UPDATE projectapplication 
                SET status = :status
                WHERE user_id = :user_id AND project_id = :project_id
            """), {
                "status": data["status"],
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })

         conn.commit()
        
         if result.rowcount == 0:
                return jsonify({"error": "Application not found"}), 404

         return jsonify({"message": "Status updated successfully"})

      except Exception as e:
            return jsonify({"error": str(e)}), 500


def accept_mentor_sql(data):
 #update ,push to project member table ,delete other mentor request
  with engine.connect() as conn:
     try:

        ##cond if  metnor page is not updated and  mentor accepted then error wll come handle that
        #update
        result=conn.execute(text("""
    UPDATE "mentorrequest" 
    SET status = :status8a
    WHERE mentor_id = :mentor_id AND project_id = :project_id;
"""),{
   
    "status": data["status"],  # "Accepted" or "Rejected"
    "mentor_id": data["mentor_id"],
    "project_id": data["project_id"]
})
      
        if data['status']=='Accepted':

            ### delete other mentor request
         result1=conn.execute(text("""
 DELETE FROM "mentorrequest" 
    WHERE project_id = :project_id AND status IN ('Rejected', 'Pending');


"""
        ),{
                "project_id": data["project_id"]


                }
                )
        ### insert into project members table
        result2=conn.execute(text("""
INSERT INTO "projectmembers" (project_id, user_id, role)
VALUES (:val1, :val2, :val3);
"""),{
    "val1":data['project_id'],
    "val2":data['mentor_id'],
    "val3":"mentor"
})
        conn.commit()
        return jsonify({"mentor":"accepted"})


     except Exception as e:
            return jsonify({"error": str(e)}), 500

  
     

    






         
























         # do url thing so after refresh data stays there




      
          


 
   
       
       
          
       
      

