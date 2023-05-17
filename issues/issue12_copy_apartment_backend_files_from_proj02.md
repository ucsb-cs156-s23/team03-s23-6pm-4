Bring over backend crud files for Apartment from team02


# Acceptance Criteria:

- [ ] The `@Entity` class called Apartment.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `ApartmentRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `ApartmentRepository.java`; the team02 instrutions erronously called it `Apartment.java`; if you called it `Apartment.java` please update the name now)
- [ ] The `@Repository` class called `ApartmentRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `ApartmentRepository.java`; the team02 instrutions erronously called it `Apartment.java`; if you called it `Apartment.java` please update the name now)
- [ ] The controller file `ApartmentController.java` is copied from team02 to team03
- [ ] The controller tests file `ApartmentControllerTests.java` is copied from team02 to team03

- [ ] You can see the `apartments` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `apartments` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Apartment` all work properly in Swagger.

