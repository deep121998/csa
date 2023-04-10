const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getAllMusicData = async (event, context) => {
  try {
    const params = {
      TableName: 'musicdata'
    };
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

exports.getMusicDataByRank = async (event, context) => {
  try {
    const { rank } = event.pathParameters;
    const params = {
      TableName: 'musicdata',
      KeyConditionExpression: 'Rank = :r',
      ExpressionAttributeValues: {
        ':r': parseInt(rank)
      }
    };
    const { Items } = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

exports.addMusicData = async (event, context) => {
  try {
    const { Album, Artist, Genre, Rank, Year } = JSON.parse(event.body);
    const params = {
      TableName: 'musicdata',
      Item: {
        Album,
        Artist,
        Genre,
        Rank: parseInt(Rank),
        Year: parseInt(Year)
      },
      ConditionExpression: 'attribute_not_exists(Rank)'
    };
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added successfully.' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

exports.updateMusicData = async (event, context) => {
  try {
    const { Album, Artist, Genre, Rank, Year } = JSON.parse(event.body);
    const params = {
      TableName: 'musicdata',
      Key: {
        Rank: parseInt(event.pathParameters.rank)
      },
      UpdateExpression: 'set Album = :a, Artist = :art, Genre = :g, Year = :y',
      ExpressionAttributeValues: {
        ':a': Album,
        ':art': Artist,
        ':g': Genre,
        ':y': parseInt(Year)
      },
      ReturnValues: 'UPDATED_NEW'
    };
    const { Attributes } = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Attributes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

exports.deleteMusicData = async (event, context) => {
  try {
    const params = {
      TableName: 'musicdata',
      Key: {
        Rank: parseInt(event.pathParameters.rank)
      },
      ReturnValues: 'ALL_OLD'
    };
    const { Attributes } = await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Attributes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
