import Category from '../../model/category.js'

// View category

export const loadCategory = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {name : {$regex : search, $options : 'i'} }
         
        const categoryDetails = await Category.find(search ? searchQuery : {})
        .skip(skip)
        .limit(limit)
        
        if(!categoryDetails || categoryDetails.length === 0) 
            return res.status(404).json({message : 'category not found'});

        return res.status(200).json(categoryDetails)

    } catch (error) {
        console.log('Error loading categories',error);
        return res.status(500).json({ message: 'Error loading categories', error: error.message });
    }

}

// Add category

export const addCategory = async (req,res) => {
    
    try {
        const {name,description,icon,isActive} = req.body
        const existCategory = await Category.findOne({name})
        if(existCategory) return res.status(409).json({message : 'Category already exists'})
    
        const newCategory = new Category({
           name,description,icon,isActive
        })

        await newCategory.save()

        return res.status(200).json({message : 'Category created successfully', newCategory})

    } catch (error) {
        console.log('Error adding category',error);
        return res.status(500).json({ message: 'Error adding category', error: error.message });
    }

}

// update category

export const updateCategory = async (req,res) => {
    
    try {

        const category_ID = req.params.id
        const category = await Category.findById(category_ID)
        if(!category) return res.status(404).json({message : 'category not found'})

        const {description,icon,isActive} = req.body

        const newData = await Category.findByIdAndUpdate(category_ID ,{
            description,icon,isActive
        },{new : true})

        return res.status(200).json({message : 'updating category success ',newData})

        
    } catch (error) {
        console.log('Error updating category',error);
        return res.status(500).json({ message: 'Error updating category', error: error.message });
    }

}

// delete category

export const deleteCategory = async (req,res) => {
    
    try {
        const category_ID = req.params.id
        const category = await Category.findById(category_ID)
        if(!category) return res.status(404).json({message : 'category not found'})
        
        await Category.findByIdAndDelete(category_ID);

        return res.status(200).json({message : 'category deleted successfully'})

    } catch (error) {
        console.log('Error deleting category',error);
        return res.status(500).json({ message: 'Error deleting category', error: error.message });
    }

}

// Add course to category

