from sqlalchemy import create_engine,text
import psycopg2
from flask import Flask, request, jsonify
import binascii
#engine = create_engine('postgresql+psycopg2://postgres:Karn1234@localhost:5432/postgres', echo=True)
engine = create_engine('postgresql://neondb_owner:npg_in9MJCT7Dzqu@ep-twilight-poetry-a1ynwudg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require', echo=True)

from Crypto.Cipher import AES
import os
import base64

def insert():
    # Insert user data into the database
    with engine.connect() as conn:
        query = text("""
            INSERT INTO "User" (roll_no, name, email)
            VALUES (:roll_no, :name, :email)
        """)
        conn.execute(query, {
            "roll_no": "sds",
            "name":"Adi",
            "email": "wwd"
        })
        conn.commit()  # Commit the transaction
        return jsonify({"project":"added"})



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

def user_insert_google_sql(data):

    try:
        # Connect to the database
        with engine.connect() as conn:
            RESULT1=conn.execute(text("""select * from "User" where roll_no=:val1"""),{

              "val1":data['roll_no']


            })

            if(RESULT1.rowcount>0):
                return jsonify({"user":"already exist"}), 401

            query = text("""INSERT INTO "User" (roll_no, name,email) VALUES (:roll_no, :name,:email)""")
            conn.execute(query, {"roll_no":data["roll_no"], "name": data['user_name'],"email":data['email']})
            conn.commit()  # Commit the transaction
        return  jsonify({"user":"registered successfully"})
    except Exception as e:
        return f"Error: {str(e)}"

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
         result1=conn.execute(text("""select project_id from "Project"
                                   where admin_id=:val1 and title=:val2""")
                                   ,{
                                       
"val1":data['admin_id'],
          "val2":data['title'],

                                   })
         project_id=result1.fetchall()[0].project_id
         query = """
INSERT INTO projectmembers (project_id, member_id, role)
VALUES (:val1, :val2, :val3)
"""

# Execute the query using bound parameters
         result2 = conn.execute(text(query), {
    "val1": project_id,
    "val2": data['admin_id'],
    "val3": "admin"
})        
         conn.commit()
         
         return jsonify({"project":"added"})


       

     except Exception as e: 
         return jsonify({"error": str(e)}), 500 
def ranking():
      #changes for new db rating to project rating
    with engine.connect() as conn:
        result=conn.execute(text("""SELECT 
    p.project_id, 
    p.title, 
    AVG(r.score)*0.7+0.3 * COUNT(r.comment) AS score
    FROM 
                               
    projectrating r
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
        
        #print(data)
        return jsonify({"project": data})
    
def rankings():
      #changes for new db rating to project rating
    with engine.connect() as conn:
        result=conn.execute(text("""SELECT 
    p.project_id, 
    p.title, 
    AVG(r.rating_value)*0.7+0.3 * COUNT(r.review) AS score
    FROM 
                               
    projectrating r
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
        
        #print(data)
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
        "project_update": row[9],
        "name":row[10]
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
            linkedin_profile = :linkedin_profile
           
            
           
        WHERE roll_no = :roll_no
    """)

            conn.execute(query, {
        
        "past_experience": data["past_experience"],
        "tech_stack": data["tech_stack"],
        "github_profile": data["github_profile"],
        "linkedin_profile": data["linkedin_profile"],
        "roll_no":data["roll_no"]
       
      
        
    })
  
            conn.commit()
            return jsonify({"profile":"updated"})
        except Exception as e:
            
            print(e,"s")
            return jsonify({"error": str(e)}), 500
            print(e,"s")
        


def list_users_sql():
   #for students only:
   with engine.connect() as conn:
        try:
            query = text("""
                SELECT 
                    u.*, 
                     
                    COUNT(u.roll_no) AS project_count
                FROM 
                    "User" u
                LEFT JOIN 
                    "projectmembers" p ON u.roll_no = p.member_id
                left JOIN 
                    "Project" pa ON p.project_id = pa.project_id
               
                GROUP BY 
                    u.roll_no
            """)

            result = conn.execute(query)
            rows = result.fetchall()

            data = [
                {
                    "roll_no": row[0],
                    "email": row[1],
                    "past_experience": row[2],
                    "tech_stack": row[3],
                    "github_profile": row[4],
                    "linkedin_profile": row[5],
                    "role_type": row[6],
                    "rating": row[7],
                    "email_update": row[8],
                    "project_update": row[9],
                    "name":row[10],
                    "project_count": row[11]   # Count of users per project
                }
                for row in rows
            ]

            return jsonify({"projects": data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

def list_of_mentors_sql(data):
   #list of mentors  # addxtaus of reject applied pending
   ##first check whether project  has mentor or not.
 with engine.connect() as conn:

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
    CASE 
        WHEN m.status = 'Pending' THEN 'Pending' 
        ELSE 'Apply' 
    END AS status  
FROM "User" u
LEFT JOIN "mentorrequest" m 
    ON u.roll_no = m.mentor_id 
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
        "name":row[10],
        "status": row[11     ]
      
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
          #check forreuested at
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
      

def  admin_request_sql(data):
     with engine.connect() as conn:
      try:
         result=conn.execute(text("""Insert into "projectjoin" (user_id,project_id,role,remarks)
    VALUES(:val1,:val2,:val3,:val4);"""),{
       "val1":data['to_user_id'],
       "val2":data['project_id'],
        "val3":data['role'],
        "val4":data['remarks']





         })
         conn.commit()
         return jsonify({"user":"requested"})
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      

def admin_request_accept_sql(data):
    data = request.json
    query_check_exists = text("""
        SELECT COUNT(*) FROM "projectjoin"
        WHERE user_id = :user_id AND project_id = :project_id;
    """)
    query_update = text("""
        UPDATE "projectjoin" 
        SET status = :status
        WHERE user_id = :user_id AND project_id = :project_id;
    """)

    query_insert_member = text("""
        INSERT INTO "projectmembers" (project_id, member_id, role)
        VALUES (:project_id, :member_id, :role)
    """)

    query_delete_others = text("""
        DELETE FROM "projectjoin" 
        WHERE project_id = :project_id 
        AND user_id = :user_id;
    """)

    try:
        with engine.connect() as conn:
            result = conn.execute(query_check_exists, {
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })
            request_exists = result.scalar() # Get the count result
            print(request_exists,"ss")
            if request_exists == 0:
                return jsonify({"error": "No join request found"}), 400
            conn.execute(query_update, {
                "status": data["status"],
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })

            if data["status"] == "Accepted":
                 result1=conn.execute(text("""select * from projectjoin
                                              
                      where user_id=:val1 and project_id=:val2                        
                                              
                                              
                                              """),{
                                                  
                "val1":data["user_id"],
                "val2":data["project_id"]


                                              })
                  
                 rows=result1.fetchall()
                 datas = [
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

                 conn.execute(query_insert_member, {
                    "member_id": data["user_id"],
                    "project_id": data["project_id"],
                    "role": datas[0]["role"] #add later
                })

                 conn.execute(query_delete_others, {
                    "project_id": data["project_id"],
                    "user_id": data["user_id"]
                })

                 conn.commit()
            else:
              conn.execute(query_delete_others, {
                    "project_id": data["project_id"],
                    "user_id": data["user_id"]
                })
              conn.commit()
            return jsonify({"request": "updated"}), 200

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
def update_project_application_status_sql(data):
# ak update status by admin and add in project members table
    # update /apply/takeback project applied
    #user_id which sent
    with engine.connect() as conn:
      try:
         results = conn.execute(text("""
                UPDATE projectapplication 
                SET status = :status
                WHERE user_id = :user_id AND project_id = :project_id
            """), {
                "status": data["status"],
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })

         conn.commit()
        
         if results.rowcount == 0:
                return jsonify({"error": "Application not found"}), 404
         
         else:
            with engine.connect() as conn:
              
                  if data["status"] =="Accepted":
                
                    #take role from project application table
                       # include in pm table
                       #delete from project application table
                    result1=conn.execute(text("""select * from projectapplication
                                              
                      where user_id=:val1 and project_id=:val2                        
                                              
                                              
                                              """),{
                                                  
                "val1":data["user_id"],
                "val2":data["project_id"]


                                              })
                  
                    rows=result1.fetchall()
                    datas = [
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


                                         # include in pm table
                    with engine.connect() as conn:
                        res=conn.execute(text(""" INSERT INTO "projectmembers" (project_id, member_id, role)
        VALUES (:project_id, :member_id, :role)"""),{
  "member_id": data["user_id"],
                    "project_id": data["project_id"],
                    "role": datas[0]["role"] #add later

        })
                        conn.commit()



                    with engine.connect() as conn:
                      result3=conn.execute(text("""

DELETE FROM projectapplication WHERE user_id = :val1 and project_id=:val2
                                                
    
                                            """),{

  
"val1":data["user_id"],
"val2":data["project_id"]


                                            })
                      conn.commit()
              
               
                
                      
                     
                    
                  else:
                       result4=conn.execute(text("""

DELETE FROM projectapplication WHERE user_id = :val1
                                                
    
                                            """),{

  
"val1":data["user_id"]


                                            })
                       conn.commit()

         return jsonify({"project":"updated"})
                      
                  
                    
                  
             

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
    SET status = :status
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
     


def list_projects_sql(data):
   

     #show  pending ,part of project,apply ,closed
     #pending project projectapplication
     #part of  project  projetct project members

    with engine.connect() as conn:
     try:
          result=conn.execute(text(
             """SELECT 
    p.*, 
    CASE 
        WHEN pm.member_id IS NOT NULL THEN 'Part'
        WHEN p.status IN ('Completed', 'Active') THEN 'Closed'
        WHEN pa.status = 'Pending' THEN 'Pending'
        ELSE 'Apply Now'
    END AS status
FROM "Project" AS p
LEFT JOIN projectmembers AS pm 
    ON p.project_id = pm.project_id AND pm.member_id = :val1
LEFT JOIN projectapplication AS pa 
    ON p.project_id = pa.project_id AND pa.user_id = :val1;

"""



          ),{
             
  'val1':data['user_id']

          })
          rows=result.fetchall()
          data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[9],  
        "tags": row[8]  
    }
      for row in rows
]
           


          return jsonify({"project":data})
     except Exception as e:
            return jsonify({"error": str(e)}), 500
          
       


     
def list_current_projects_sql(data):
   with engine.connect() as conn:
      
    try:
       result=conn.execute(text("""select p.* ,pm.role
                                from "Project" as p
                                join projectmembers as pm
                                on  p.project_id=pm.project_id
                                 WHERE pm.member_id = :val1
                                and p.status in ('Planning','Active')
      
                                         
       
       """),
                           
                           {
                              
                        'val1':data['user_id']
                              })
       rows=result.fetchall()
       data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[7],  
        "tags": row[8],
        "role":row[9]
    }
      for row in rows
]
           
       

       return jsonify({"project":data}) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def list_past_projects_sql(data):
       
       with engine.connect() as conn:
          try:
             result=conn.execute(text("""select p.* ,pm.role
                                from "Project" as p
                                join projectmembers as pm
                                on  p.project_id=pm.project_id
                                 WHERE pm.member_id = :val1
                                and p.status ='Completed'
      
                                         
       
       """),
                                 
                                 {


                          'val1': data['user_id']
              

                                 })
             rows=result.fetchall()
             data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[7],  
        "tags": row[8],
        "role":row[9] 
    }
      for row in rows
]
             return jsonify({"project":data}) 

             
          except Exception as e:
                     return jsonify({"error": str(e)}), 500
          

def list_myprojects_sql(data):
   

     #show  pending ,part of project,apply ,closed
     #pending project projectapplication
     #part of  project  projetct project members

    with engine.connect() as conn:
     try:
          result=conn.execute(text(
             """SELECT 
    p.*, 
    CASE 
        WHEN pa.status = 'Pending' THEN 'Applied'
        WHEN p.status IN ('Completed') THEN 'Completed'
        WHEN p.status IN ('Planning','Active')  THEN 'Active'
        
        ELSE 'Apply Now'
    END AS status
FROM "Project" AS p
LEFT JOIN projectmembers AS pm 
    ON p.project_id = pm.project_id AND pm.member_id = :val1
LEFT JOIN projectapplication AS pa 
    ON p.project_id = pa.project_id AND pa.user_id = :val1
    WHERE pm.project_id IS NOT NULL OR pa.project_id IS NOT NULL;


"""



          ),{
             
  'val1':data['user_id']

          })
          rows=result.fetchall()
          data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[9],  
        "tags": row[8]  
    }
      for row in rows
]
           


          return jsonify({"project":data})
     except Exception as e:
            return jsonify({"error": str(e)}), 500



def notification_sql(data):
 with engine.connect() as conn:
    result = conn.execute(text("""
    SELECT * 
    FROM projectapplication AS pa
    JOIN "Project" AS p
                                
    ON p.project_id = pa.project_id 
    WHERE p.admin_id=:user_id
    AND pa.status = 'Pending'
"""), {"user_id": data["user_id"]})
    pending_applications = result.fetchall()

    applications_json = [
    {
        "application_id": application[0],
        "user_id": application[1],
        "project_id": application[2],
        "role": application[3],
        "status": application[4],
        "applied_at": application[5].isoformat(),  # Convert timestamp to ISO format string
        "remarks": application[6],
        "applied":"user",
        "title":application[9]
    }
    for application in pending_applications
    ]

    result = conn.execute(text("""
    SELECT * 
    FROM projectjoin
    WHERE user_id = :user_id
    AND status = 'Pending';
"""), {"user_id": data["user_id"]})
    

    project_join_results = result.fetchall()

    project_joins_json = [
    {
        "application_id": application[0],
        "user_id": application[1],
        "project_id": application[2],
        "role": application[3],
        "status": application[4],
        "applied_at": application[5].isoformat(),  # Convert timestamp to ISO format string
        "remarks": application[6],
        "applied":"admin"
    }
    for application in project_join_results
    ]
    all_notifications_json = applications_json + project_joins_json
    return jsonify({"notification":all_notifications_json}),200
def member_sql(data):
    query = text("""
        SELECT *
        FROM projectmembers 
        WHERE project_id = :project_id AND member_id = :member_id
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {
            "project_id":data['project_id'],
            "member_id": data['member_id']
        })

        row=result.fetchone()

        if(row):

            return jsonify({"member":"yes","role":row[2]}), 200

           
        
        else:
            return jsonify({"member":"no"}), 401
     



     
     
          
       



             
       
       


     





  
     

    






         
























         # do url thing so after refresh data stays there




      
          


 
   
       
       
          
       
      

