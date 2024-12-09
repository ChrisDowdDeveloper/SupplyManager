const supabase = require("../db/connection");

async function list() {
    try {
        const { data, error } = await supabase.from("orders").select("*");
        
        if(error) throw error;

        return data;
    } catch(error) {
        console.error("Error fetching orders: ", error.message);
        throw error;
    }
}

async function listById(id) {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    *,
                    items (*)
                )
            `)
            .eq("id", id)
            .single();

        if (error) throw new Error(`Error fetching order ${id}: ${error.message}`);

        return data;
    } catch (error) {
        console.error("Error fetching order with items:", error.message);
        throw error;
    }

}

async function create(items) {
    try {
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({ order_date: new Date().toISOString() })
            .select()
            .single();

        if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

        const orderItems = items.map((item) => ({
            order_id: order.id,
            item_id: item.id,
        }));

        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (orderItemsError) throw new Error(`Order-Items creation failed: ${orderItemsError.message}`);

        return {
            order,
            orderItems: orderItemsData,
        };
    } catch (error) {
        console.error("Error creating order with items:", error.message);
        throw error;
    }
}

async function listByDateRange(from, to) {
    const fromDate = `${from} 00:00:00`;
    const toDate = `${to} 23:59:59`;
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("order_date", fromDate)
        .lte("order_date", toDate);

    if (error) throw new Error(`Database error: ${error.message}`);

    return data;
}




module.exports = {
    list, 
    listById,
    create,
    listByDateRange
}