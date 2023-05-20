Bring over backend crud files for Music from team02


# Acceptance Criteria:

- [ ] The `@Entity` class called Music.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `MusicRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `MusicRepository.java`; the team02 instrutions erronously called it `Music.java`; if you called it `Music.java` please update the name now)
- [ ] The `@Repository` class called `MusicRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `MusicRepository.java`; the team02 instrutions erronously called it `Music.java`; if you called it `Music.java` please update the name now)
- [ ] The controller file `MusicController.java` is copied from team02 to team03
- [ ] The controller tests file `MusicControllerTests.java` is copied from team02 to team03

- [ ] You can see the `musics` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `musics` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Music` all work properly in Swagger.

