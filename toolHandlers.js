import tools from "./toolData.js";

function handleGetAllTools(req, res) {
  const category = req.query.category;
  const availability = req.query.availability;

  if (availability!== undefined && !['true', 'false'].includes(availability)) {
    return res.status(400).json({error: 'Unknown availability parameter'});
  }

  let result = [...tools];
  if (typeof category === 'string') {
    result = result.filter(tool => tool.category === category);
  }
  if (availability) {
    result = result.filter(tool => tool.availability === (availability === 'true'));
  }
  res.status(200).json(result);
}

function handlePostTool(req, res) {
  let id = tools.length === 0 ? 1 : Math.max(...tools.map(tool => tool.id)) + 1;

  const tool = req.body;

  if(!isValidToolPost(tool)) {
    return res.status(422).json({error: 'Malformed tool data'});
  }
  const newTool = {id, name: tool.name, category: tool.category, condition: tool.condition, availability: tool.availability};
  tools.push(newTool);
  return res.status(201).json(newTool);
}

function handleGetToolById(req, res) {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({error: 'Malformed id'});
  }
  
  const tool = tools.find(tool => tool.id === Number(id));

  if (!tool) {
    return res.status(404).json({error: 'Tool not found'});
  }

  return res.status(200).json(tool);
}

function handleUpdateToolById(req, res) {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({error: 'Malformed id'});
  }

  const indexToUpdate = tools.findIndex(tool => tool.id === Number(id));
  
  if (indexToUpdate === -1) {
    return res.status(404).json({error: 'Tool not found'});
  }

  const tool = req.body;

  if (!isValidToolUpdate(tool)) {
    return res.status(422).json({error: 'Malformed tool data'});
  }

  Object.assign(tools[indexToUpdate], tool);
  return res.status(200).json(tools[indexToUpdate]);
}

function handleDeleteToolById(req, res) {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({error: 'Malformed id'});
  } 
  const toolIndex = tools.findIndex(tool => tool.id === Number(id));
  
  if (toolIndex === -1){
    return res.status(404).json({error: 'Tool not found'});
  }

  tools.splice(toolIndex, 1);
  return res.status(204).end();
}

function isValidId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

function isValidObject(data) {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

function isValidToolPost(data) {
  return isValidObject(data) && Object.entries(data).length === 4 && isValidTool(data);
}

function isValidToolUpdate(data) {
  return isValidObject(data) && Object.entries(data).length >= 1 && isValidTool(data);
}

function isValidTool(data) {
  const validToolProperties = ['name', 'category', 'condition', 'availability'];

  const entries = Object.entries(data);

  for (let [property, value] of entries) {
    if (!validToolProperties.includes(property)) {
      return false;
    } 
    switch (property) {
      case 'name':
        if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 50) {
          return false;
        }
        break;
      case 'category':
        if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 50) {
          return false;
        }
        break;
      case 'condition':
        if (!['new', 'good', 'fair', 'poor'].includes(value)) {
          return false;
        }
        break;
      case 'availability':
        if (typeof value !== 'boolean') {
          return false;
        }
        break;
    }
  }
  return true;
}

export { 
  handleGetAllTools,
  handlePostTool,
  handleGetToolById,
  handleUpdateToolById,
  handleDeleteToolById
}