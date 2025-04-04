from marshmallow import Schema, fields,INCLUDE,validate,EXCLUDE


class UserSchema(Schema):
    #roll_no = fields.Int()  # Primary Key
    email = fields.Email()  # Unique email field
    past_experience = fields.Str(allow_none=True)  # Can be NULL
    tech_stack = fields.List(fields.Str())  # Default empty array
    github_profile = fields.Url(allow_none=True)  # Optional, unique
    linkedin_profile = fields.Url(allow_none=True)  # Optional
    role_type = fields.Str(validate=validate.OneOf(["student", "professor", "alumni"]))  # Enum validation
    rating = fields.Float(validate=validate.Range(min=0, max=5))  # 0 to 5 rating
    #email_update = fields.Bool(missing=False)  # Default: False
    #project_update = fields.Bool(missing=False)  # Default: False
    class Meta:
        unknown = EXCLUDE

class add_project_schema(Schema):
    #admin_id=fields.Int(required=True)
    title=fields.Str(required=True)
    description=fields.Str(required=True)
    start_date=fields.Date(required=True)
    end_date=fields.Date(required=True)
    members_required=fields.Int(required=True)
    status=fields.Str(validate=validate.OneOf(["Active","Completed","Planning"]),required=True)
    #tags=fields.List(fields.Str(),required=True)
    tags=fields.Str(required=True)


    class Meta:
        unknown = EXCLUDE

class first_login_schema(Schema):
    #roll_no=fields.Int(required=True)


    class Meta:
        unknown = EXCLUDE

class list_of_mentors_schema(Schema):
    project_id=fields.Int(required=True)


    class Meta:
        unknown = EXCLUDE

class apply_mentors_schema(Schema):
    project_id = fields.Int(required=True)
   # admin_id = fields.Int(required=True)
    #mentor_id = fields.Int(required=True)
    status = fields.Str(validate=validate.Equal("pending"), required=True)
    requested_at = fields.DateTime(required=True)  # Ensure it's a valid datetime
    remarks = fields.Str(allow_none=True)  # Optional field, can be null

    class Meta:
        unknown = EXCLUDE  # Ignore unknown fields

class apply_mentors_status_takeback_schema(Schema):
    project_id=fields.Int(required=True)
   # mentor_id=fields.Int(required=True)

    class Meta:
        unknown = EXCLUDE

class apply_mentors_status_takeback_schema(Schema):
    project_id=fields.Int(required=True)
   # mentor_id=fields.Int(required=True)

    class Meta:
        unknown = EXCLUDE

class accept_mentor_schema(Schema):
    project_id=fields.Int(required=True)
   # mentor_id=fields.Int(required=True)
    status=fields.Str(validate=validate.OneOf(["accepted","rejected"]),required=True)

class apply_project_schema(Schema):
    project_id=fields.Int(required=True)
   # user_id=fields.Int(required=True)
    role=fields.Str(required=True)
    remarks = fields.Str(allow_none=True)
    class Meta:
        unknown = EXCLUDE

class apply_project_status_schema(Schema):
   # user_id=fields.Int(required=True)
    project_id=fields.Int(required=True)

    class Meta:
        unknown = EXCLUDE


class list_apply_project_schema(Schema):
    application_id = fields.Int(required=True)
    #user_id = fields.Int(required=True)
    project_id = fields.Int(required=True)
    role = fields.Str(required=True)
    status = fields.Str(required=True)
    remarks = fields.Str(allow_none=True)  # Optional field, can be null


class list_projects_scheme(Schema):

 #user_id=fields.Int(required=True)
 class Meta:
        unknown = EXCLUDE







    

