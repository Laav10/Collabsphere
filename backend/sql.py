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
     


#laavanya

def get_project_details(project_id):
    try:
        with engine.connect() as conn:
            project_query = text("""
                SELECT 
                    description,
                    title,
                    start_date,
                    end_date,
                    members_required,
                    status,
                    tags
                FROM "Project"
                WHERE project_id = :project_id
            """)
            project = conn.execute(project_query, {"project_id": int(project_id)}).fetchone()  

            #print(f"Fetched project: {project}")  

            if not project:
                return None

            project_details = {
                "description": project[0],  
                "title": project[1],
                "start_date": project[2].isoformat() if project[2] else None,
                "end_date": project[3].isoformat() if project[3] else None,
                "project_size": project[4],
                "project_type": project[5],
                "github_link": None,
                "tech_stack": project[6] if project[6] else [],
                "team_members": []
            }

            members_query = text("""
                SELECT u.name
                FROM projectmembers pm
                JOIN "User" u ON pm.member_id = u.roll_no
                WHERE pm.project_id = :project_id
            """)
            members = conn.execute(members_query, {"project_id": project_id}).fetchall()

            project_details["team_members"] = [member[0] for member in members]  #

        return project_details
    except Exception as e:
        print(f"Error in get_project_details: {e}")
        return None


def get_project_analytics(project_id):
    try:
        project_id = int(project_id)

        with engine.connect() as conn:
            # Fetch project start_date and end_date
            proj_query = text("""
                SELECT start_date, end_date
                FROM "Project"
                WHERE project_id = :project_id
            """)
            project = conn.execute(proj_query, {"project_id": project_id}).mappings().fetchone()
            
            if not project:
                print(f"Project {project_id} not found")
                return None

            # Fetch sprint start and end dates
            sprint_query = text("""
                SELECT sprint_id, name, start_date, end_date
                FROM sprint
                WHERE project_id = :project_id
                ORDER BY sprint_id
            """)
            sprints = conn.execute(sprint_query, {"project_id": project_id}).mappings().all()

            sprint_data = [
                {
                    "sprint_id": s["sprint_id"],
                    "name": s["name"],
                    "start_date": s["start_date"],
                    "end_date": s["end_date"]
                }
                for s in sprints
            ]

            # Fetch tasks
            tasks_query = text("""
                SELECT sprint_number, status, points
                FROM task
                WHERE project_id = :project_id
            """)
            tasks = conn.execute(tasks_query, {"project_id": project_id}).mappings().all()
            
            # Calculate task stats
            total_tasks = len(tasks)
            completed_tasks = [t for t in tasks if t["status"] == "done"]
            total_completed = len(completed_tasks)
            percentage_completed = (total_completed / total_tasks * 100) if total_tasks > 0 else 0

            # Sprint analysis
            sprint_numbers = [t["sprint_number"] for t in tasks if t["sprint_number"] is not None]
            latest_sprint = max(sprint_numbers, default=None)
            sprint_velocity = (
                sum(t["points"] for t in tasks if t["sprint_number"] == latest_sprint and t["status"] == "done")
                if latest_sprint is not None else 0
            )

            # Team size
            team_query = text("""
                SELECT COUNT(*) as team_count
                FROM projectmembers
                WHERE project_id = :project_id
            """)
            team_result = conn.execute(team_query, {"project_id": project_id}).mappings().fetchone()
            team_count = team_result["team_count"] if team_result else 0  

            # Team efficiency 
            total_completed_points = sum(t["points"] for t in tasks if t["status"] == "done")
            team_efficiency = total_completed_points / team_count if team_count > 0 else 0

            # Pending days calculation
            pending_days = 0
            if project["end_date"]:
                delta = project["end_date"] - date.today()
                pending_days = max(delta.days, 0)  

            # Sprint burndown chart
            sprint_progress = {}
            for t in tasks:
                sprint = t["sprint_number"] or 0
                if sprint not in sprint_progress:
                    sprint_progress[sprint] = {"planned": 0, "completed": 0}
                sprint_progress[sprint]["planned"] += t["points"]
                if t["status"] == "done":
                    sprint_progress[sprint]["completed"] += t["points"]

            burndown_data = [
                {
                    "sprint_number": sprint,
                    "planned_points": data["planned"],
                    "completed_points": data["completed"]
                }
                for sprint, data in sorted(sprint_progress.items())
            ]

            velocity_trend = [
                {"sprint_number": sprint, "velocity": data["completed"]}
                for sprint, data in sorted(sprint_progress.items())
            ]

            # Team performance
            performance_query = text("""
                SELECT t.assigned_to::TEXT, COUNT(*) as total_tasks, 
                    SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as done_tasks
                FROM task t
                WHERE t.project_id = :project_id
                GROUP BY t.assigned_to::TEXT
            """)
            performance = conn.execute(performance_query, {"project_id": project_id}).mappings().all()

            team_performance = []
            for p in performance:
                name_query = text("SELECT name FROM \"User\" WHERE roll_no = :roll_no")
                user = conn.execute(name_query, {"roll_no": p["assigned_to"]}).mappings().fetchone()
                member_name = user["name"] if user else p["assigned_to"]
                
                completion_rate = (p["done_tasks"] / p["total_tasks"] * 100) if p["total_tasks"] > 0 else 0
                team_performance.append({
                    "member": member_name,
                    "done_tasks": p["done_tasks"],
                    "total_tasks": p["total_tasks"],
                    "completion_rate": round(completion_rate, 2)  
                })

            summary = {
                "total_tasks": total_tasks,
                "completed_tasks": total_completed,
                "total_points": sum(t["points"] for t in tasks),
                "completed_points": total_completed_points,
                "team_size": team_count
            }

            analytics = {
                "project_start_date": project["start_date"],
                "project_end_date": project["end_date"],
                "sprints": sprint_data,
                "percentage_completed": round(percentage_completed, 2),
                "sprint_velocity": sprint_velocity,
                "team_efficiency": round(team_efficiency, 2),
                "pending_days": pending_days,
                "burndown_data": burndown_data,
                "velocity_trend": velocity_trend,
                "team_performance": team_performance,
                "summary": summary  
            }

            print(f"Analytics generated for project {project_id}")
            return analytics

    except Exception as e:
        print(f"Error in get_project_analytics: {e}")
        import traceback
        traceback.print_exc()  
        return None

def add_task(project_id, sprint_number, description, assigned_to, points):
    """Insert a new task into the 'task' table."""
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO task (project_id, sprint_number, description, assigned_to, status, points)
                VALUES (:project_id, :sprint_number, :description, :assigned_to, 'pending', :points)
            """), {
                "project_id": project_id,
                "sprint_number": sprint_number,
                "description": description,
                "assigned_to": assigned_to,
                "points": points
            })
            conn.commit()
        return True, "Task added successfully"
    except Exception as e:
        print(f"Error adding task: {e}")
        return False, str(e)
 
def get_sprint_tasks(project_id):
    try:
        project_id = int(project_id)  
        
        with engine.connect() as conn:
            project_check = text("""
                SELECT project_id FROM "Project" 
                WHERE project_id = :project_id
            """)
            project = conn.execute(project_check, {"project_id": project_id}).mappings().fetchone()
            if not project:
                print(f"Project {project_id} not found")
                return None
            
            sprint_query = text("""
                SELECT DISTINCT sprint_number,
                (SELECT COUNT(*) FROM task t2 WHERE t2.project_id = :project_id AND t2.sprint_number = t.sprint_number) AS total_tasks,
                (SELECT COUNT(*) FROM task t2 WHERE t2.project_id = :project_id AND t2.sprint_number = t.sprint_number AND t2.status = 'done') AS completed_tasks
                FROM task t
                WHERE t.project_id = :project_id AND t.sprint_number IS NOT NULL
                ORDER BY sprint_number
            """)
            sprints = conn.execute(sprint_query, {"project_id": project_id}).mappings().all()
            
            if not sprints:
                unassigned_check = text("""
                    SELECT COUNT(*) as count FROM task 
                    WHERE project_id = :project_id
                """)
                unassigned = conn.execute(unassigned_check, {"project_id": project_id}).mappings().fetchone()
                if unassigned and unassigned["count"] > 0:
                    sprints = [{
                        "sprint_number": None,
                        "total_tasks": unassigned["count"],
                        "completed_tasks": 0
                    }]
            
            sprint_data = []
            
            column_check = text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'task' AND column_name = 'title'
            """)
            title_exists = conn.execute(column_check).fetchone() is not None
            
            for sprint in sprints:
                sprint_number = sprint["sprint_number"]
                
                task_query = text(f"""
                    SELECT id, description, assigned_to, points, status
                    {', title' if title_exists else ''}
                    FROM task
                    WHERE project_id = :project_id 
                      AND (sprint_number = :sprint_number OR (:sprint_number IS NULL AND sprint_number IS NULL))
                    ORDER BY status
                """)
                tasks = conn.execute(task_query, {"project_id": project_id, "sprint_number": sprint_number}).mappings().all()
                
                categorized_tasks = {"todo": [], "in_progress": [], "completed": []}
                completed_count = 0
                
                for task in tasks:
                    assignee_name = None
                    if task["assigned_to"]:
                        name_query = text("SELECT name FROM \"User\" WHERE roll_no = :roll_no")
                        user = conn.execute(name_query, {"roll_no": task["assigned_to"]}).mappings().fetchone()
                        assignee_name = user["name"] if user else task["assigned_to"]
                    
                    task_data = {
                        "id": task["id"],
                        "description": task["description"],
                        "assigned_to": task["assigned_to"],
                        "assignee_name": assignee_name,
                        "points": task["points"],
                    }
                    if title_exists:
                        task_data["title"] = task["title"]
                    
                    status = task["status"].lower() if task["status"] else "pending"
                    if status in ["pending", "todo"]:
                        categorized_tasks["todo"].append(task_data)
                    elif status in ["review", "in_progress", "progress"]:
                        categorized_tasks["in_progress"].append(task_data)
                    elif status in ["done", "completed"]:
                        categorized_tasks["completed"].append(task_data)
                        completed_count += 1
                    else:
                        categorized_tasks["todo"].append(task_data)
                
                if sprint_number is None:
                    sprint["completed_tasks"] = completed_count
                
                total = int(sprint["total_tasks"])
                completed = int(sprint["completed_tasks"])
                completion_percentage = (completed / total * 100) if total > 0 else 0
                
                sprint_data.append({
                    "sprint_number": sprint_number,
                    "sprint_name": f"Sprint {sprint_number}" if sprint_number is not None else "Unassigned Tasks",
                    "total_tasks": total,
                    "completed_tasks": completed,
                    "completion_percentage": round(completion_percentage, 2),
                    "tasks": categorized_tasks
                })
            
            return sprint_data
            
    except Exception as e:
        print(f"Error in get_sprint_tasks: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_sprint_status(project_id, sprint_number):
    """Fetch the status of a given sprint."""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT status FROM sprint 
            WHERE project_id = :project_id AND sprint_id = :sprint_number
        """), {"project_id": project_id, "sprint_number": sprint_number}).fetchone()
        
        return result[0] if result else None 

    
def add_task(project_id, sprint_number, description, assigned_to, points):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO task (project_id, sprint_number, description, assigned_to, status, points)
                VALUES (:project_id, :sprint_number, :description, :assigned_to, 'pending', :points)
            """), {"project_id": project_id, "sprint_number": sprint_number, "description": description, "assigned_to": assigned_to, "points": points})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error adding task: {e}")
        return False

def get_sprints(project_id):
    try:
        with engine.connect() as conn:
            sprints = conn.execute(text("""
                SELECT sprint_id, name, start_date, end_date, status FROM sprint
                WHERE project_id = :project_id
                ORDER BY sprint_id
            """),{"project_id": project_id}).fetchall()
            return sprints
    except Exception as e:
        print(f"Error getting sprints: {e}")
        return None


def update_task(task_id, **updates):
    """Updates only the provided fields for a given task_id."""
    if not updates:
        print("No fields to update")
        return False  

    try:
        set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])
        updates["task_id"] = task_id  
        with engine.connect() as conn:
            conn.execute(text(f"""
                UPDATE task 
                SET {set_clause}
                WHERE id = :task_id
            """), updates)
            conn.commit()

        return True

    except Exception as e:
        print(f"Error updating task: {e}")
        return False


def update_task_status(task_id, new_status):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE task SET status = :status WHERE id = :task_id
            """), {"status": new_status, "task_id": task_id})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error updating task status: {e}")
        return False


def get_eligible_users_for_mod(project_id):
    try:
        with engine.connect() as conn:
            users = conn.execute(text("""
                SELECT member_id, name 
                FROM projectmembers pm
                JOIN "User" u ON pm.member_id = u.roll_no
                WHERE pm.project_id = :project_id 
                AND pm.role NOT IN ('admin', 'moderator')
            """), {"project_id": project_id}).fetchall()
            
            return users

    except Exception as e:
        print(f"Error getting eligible users: {e}")
        return None


def promote_to_moderator(conn, project_id, user_id):
    try:
        with conn.begin():
            # Fetch the current role of the user
            result = conn.execute(text("""
                SELECT role FROM projectmembers
                WHERE project_id = :project_id AND member_id = :user_id
            """), {"project_id": project_id, "user_id": user_id}).fetchone()

            # If no record is found, the user is not in the project
            if not result:
                return False, "User is not a member of this project."

            current_role = result[0]

            # If the user is already a mod or admin, prevent the update
            if current_role in ["moderator", "admin"]:
                return False, f"User is already a {current_role}."

            # Promote user to moderator
            conn.execute(text("""
                UPDATE projectmembers
                SET role = 'moderator'
                WHERE project_id = :project_id AND member_id = :user_id
            """), {"project_id": project_id, "user_id": user_id})

            return True, f"User {user_id} promoted to Moderator."

    except Exception as e:
        print(f"Error promoting user: {e}")
        return False, "Database error occurred."

def remove_moderator(project_id, user_id):
    try:
        with engine.begin() as conn:  
            result = conn.execute(text("""
                UPDATE projectmembers
                SET role = 'member'
                WHERE project_id = :project_id 
                AND member_id = :user_id 
                AND role = 'moderator'
                RETURNING member_id;
            """), {"project_id": project_id, "user_id": user_id})

            updated_user = result.fetchone() 

            if updated_user:
                return True  
            else:
                return False  

    except Exception as e:
        print(f"Error demoting user: {e}")
        return False

def add_member_rating(rated_by, rated_user, project_id, score, comment):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO memberrating (rated_by, rated_user, project_id, score, comment)
                VALUES (:rated_by, :rated_user, :project_id, :score, :comment)
            """), {
                "rated_by": rated_by,
                "rated_user": rated_user,
                "project_id": project_id,
                "score": score,
                "comment": comment
            })
            conn.commit()
        return True
    except Exception as e:
        print(f"Error adding member rating: {e}")
        return False

def is_valid_member(project_id, user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 1 FROM projectmembers
                WHERE project_id = :project_id AND member_id = :user_id
            """), {"project_id": project_id, "user_id": user_id}).fetchone()
            return result is not None
    except Exception as e:
        print(f"Error checking membership: {e}")
        return False

def is_team_member(user_id, project_id):
    """Check if the user is a member of the project"""
    try:
        query = text("""
            SELECT 1 FROM projectmembers 
            WHERE member_id = :user_id AND project_id = :project_id
        """)
        with engine.connect() as conn:
            result = conn.execute(query, {"user_id": user_id, "project_id": project_id}).fetchone()
            print(f"DEBUG: is_team_member check for {user_id} in project {project_id}: {result}")
            return result is not None  
    except Exception as e:
        print(f"Error checking team membership: {e}")
        return True  

def add_project_rating(user_id, project_id, score, comment):
    """Insert a project rating if the user is NOT a project member"""
    if is_team_member(user_id, project_id):
        print(f"User {user_id} is a team member of project {project_id}, cannot rate.")
        return False  

    try:
        query = text("""
            INSERT INTO projectrating (user_id, project_id, score, comment)
            VALUES (:user_id, :project_id, :score, :comment)
        """)
        with engine.begin() as conn:  
            conn.execute(query, {"user_id": user_id, "project_id": project_id, "score": score, "comment": comment})

        print(f"User {user_id} successfully rated project {project_id} with score {score}.")
        return True
    except Exception as e:
        print(f"Error adding project rating: {e}")
        return False

def get_last_sprint_status(project_id):
    """Fetch the latest sprint's status."""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT status FROM sprint
            WHERE project_id = :project_id
            ORDER BY sprint_id DESC LIMIT 1
        """), {"project_id": project_id}).fetchone()
        return result[0] if result else "closed"
    
def is_admin_or_mod(user_id, project_id):
    """Check if the user is an admin or moderator of the project."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT role FROM projectmembers
                WHERE project_id = :project_id AND member_id = :user_id
            """), {"project_id": project_id, "user_id": user_id}).fetchone()
            return result and result[0] in ["admin", "moderator"]
    except Exception as e:
        print(f"Error checking admin/mod status: {e}")
        return False

def create_sprint(user_id, project_id, name, start_date, end_date):
    """Create a new sprint only if the previous one is completed and the user is an admin/mod."""
    if not is_admin_or_mod(user_id, project_id):  
        return {"error": "Only an admin or mod can create a sprint."}, 403

    last_sprint_status = get_last_sprint_status(project_id)
    if last_sprint_status != "closed":
        return {"error": "Previous sprint must be completed before creating a new one."}, 400

    try:
        with engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO sprint (project_id, name, start_date, end_date, status)
                VALUES (:project_id, :name, :start_date, :end_date, 'open')
            """), {"project_id": project_id, "name": name, "start_date": start_date, "end_date": end_date})
        return {"message": "Sprint created successfully."}, 201
    except Exception as e:
        return {"error": str(e)}, 500
    


     

    






         











     
     
          
       



             
       
       


     





  
     

    






         
























         # do url thing so after refresh data stays there




      
          


 
   
       
       
          
       
      

