const supabase = require("../db/connection");

async function list() {
    try {
        const { data, error } = await supabase.from("items").select("*");
        if(error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching items: ", error.message);
        throw error;
    }
}

async function listById(id) {
    try {
        const { data, error } = await supabase
            .from("items")
            .select()
            .eq("id", id);

            if(error) throw error;
            return data;

    } catch (error) {
        console.error("Error fetching item: ", id);
        throw error;
    }
}

async function create(createdItem) {
    try {
        const { data, error } = await supabase.from('items').insert({
            item_name: createdItem.item_name,
            item_url: createdItem.item_url,
            control: createdItem.control,
            category: createdItem.category,
            sub_category: createdItem.sub_category
        });

        if(error) throw error;
        return data;

    } catch(error) {
        console.error("Error creating item");
        throw error;
    }
}

async function update(id, updatedItem) {
    try {
        const { data, error } = await supabase
            .from('items')
            .update({
                item_name: updatedItem.item_name,
                item_url: updatedItem.item_url,
                control: updatedItem.control,
                category: updatedItem.category,
                sub_category: updatedItem.sub_category
            })
            .eq('id', id);

            if(error) throw error;

            return data;
    } catch(error) {
        console.error("Error updating item: ", error);
    }
}

async function deleteItem(id) {
    try {
        const { data, error } = await supabase
            .from("items")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting item:", error.message);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error in deleteItem function for id:", id, error.message);
        throw error;
    }
}


module.exports = {
    list,
    listById,
    create,
    update,
    deleteItem
};