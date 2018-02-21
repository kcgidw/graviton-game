import * as express from 'express';
import * as http from 'http';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));

const httpServer = new http.Server(app);

httpServer.listen(port, ()=>{
	console.log('Listening on port ' + port);
});