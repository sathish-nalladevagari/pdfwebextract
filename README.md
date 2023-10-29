# pdfwebextract
# Steps to run this project locally.

## 1.Clone the project into your local machine.
## 2.Now open two terminals with two different directories for server and pdf_extract (client)
## CD into the folders
cd server
cd pdf_extract
## Install the dependencies using npm in both terminals server and pdf_extract
npm install 
## Now go to server folder and run 
npm run start
## It will run the server
## Now go to pdf_extract terminal window and run
npm run dev
## It will run the client in different local port
# Now you can go to the link and upload and generate new pdfs

## If it not works try to change the apis to localhost i may have used other url because of production
change the links to http://localhost:3000/upload
http://localhost:3000/extract

# Now its ready.
