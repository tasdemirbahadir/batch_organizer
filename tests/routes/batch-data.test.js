import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";

let server;

chai.use(chaiHttp);
describe("Batches", () => {
  before((done) => {
    server = require("../../src/server");
    done();
  });
  after((done) => {
    mongoUnit.drop();
    done();
  });
  describe("/POST batch", () => {
    it("should POST batch data and response bad request when batch id is missing in body", (done) => {
      chai
        .request(server)
        .post("/batch-data")
        .send({ value: 1 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0]).to.equal(
            "Data 'batchId' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }"
          );
          done();
        });
    });
    it("should POST batch data and response bad request when value field is missing in body", (done) => {
      chai
        .request(server)
        .post("/batch-data")
        .send({ batchId: "BATCH_ID" })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0]).to.equal(
            "Data 'value' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }"
          );
          done();
        });
    });
    it("should POST batch data and response bad request when value field is not a number", (done) => {
      chai
        .request(server)
        .post("/batch-data")
        .send({ batchId: "BATCH_ID", value: "NaN" })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0]).to.equal(
            "The value of data 'value' must be type of number. Sample body: { batchId: <string_val>, value: <number_val> }"
          );
          done();
        });
    });
    it("should POST batch data and response bad request errors when value field is missing in body and batch id is missing in body", (done) => {
      chai
        .request(server)
        .post("/batch-data")
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Data 'value' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }",
            "Data 'batchId' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }",
          ]);
          done();
        });
    });
    it("should POST batch data successfully", (done) => {
      chai
        .request(server)
        .post("/batch-data")
        .send({ batchId: "BATCH_ID_1", value: 1 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
  });
  describe("/GET batches", () => {
    it("should get max page size error", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: 0,
          size: 21,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members(["Max page size is 20"]);
          done();
        });
    });
    it("should get min page size error", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: 0,
          size: 0,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members(["Min page size is 1"]);
          done();
        });
    });
    it("should get min page value error", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: -1,
          size: 10,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members(["Min page value is 0"]);
          done();
        });
    });
    it("should get min page size and min page value errors", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: -1,
          size: -1,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Min page value is 0",
            "Min page size is 1",
          ]);
          done();
        });
    });
    it("should get page value error when page value is not a number", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: "NaN",
          size: 10,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members([
            "Page value must be a number",
          ]);
          done();
        });
    });
    it("should get page value error when page size is not a number", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: 0,
          size: "NaN",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members([
            "Page size value must be a number",
          ]);
          done();
        });
    });
    it("should get value errors when both page size and page value is not a number", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: "NaN",
          size: "NaN",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Page value must be a number",
            "Page size value must be a number",
          ]);
          done();
        });
    });
    it("should GET posted batch successfully", (done) => {
      chai
        .request(server)
        .get("/batch-data")
        .query({
          page: 0,
          size: 1,
        })
        .end((err, res) => {
          expect(res.body.items.length).to.equal(1);
          expect(res.body.items[0].batch_id).to.equal("BATCH_ID_1");
          expect(res.body.items[0].value).to.equal(1);
          done();
        });
    });
  });
});
