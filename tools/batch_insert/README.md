# tool: insert data from csv into database
- insert data into ```users``` table of the database. 

## ready
1. install [direnv](https://github.com/direnv/direnv) 

## usage
1. create ```.env``` file following [.env.template](./.env.template)
2. run ```direnv allow .``` in this directory. 
3. check environment variable ```DSN``` is setted by running ```echo $DSN```.
4. create your ```*.csv``` file following [example.csv](./example.csv) file. and check [comment](./main.go#L54-L72).
5. run your database by ```docker compose up -d``` in root directory of this repository. 
6. run ```go run main.go ${path_to_your_csv_file}``` in this directory. 
   - e.g. ```go run main.go example.csv``` 
