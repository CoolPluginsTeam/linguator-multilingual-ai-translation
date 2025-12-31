import { store } from "../../redux-store/store.js";
import { selectAllowedMetaFields } from "../../redux-store/features/selectors.js";

const updateMetafieldsKeys = ({ metaFields }) => {
    const allowedMetaFields=selectAllowedMetaFields(store.getState());
    let updatedKeys=[];

    const LoopCallback=({callback, loop, index})=>{
        callback(loop[index], index);
    
        index++;
    
        if(index < loop.length){
           LoopCallback({callback, loop, index});
        }
    }

    const metaFieldsLoop = (key, index) => {
        if (allowedMetaFields && allowedMetaFields[key] && allowedMetaFields[key].status) {
            const uniqueKey = 'metaFields_lmat_' + key;
            if (allowedMetaFields[key].type === 'string') {
                updatedKeys.push(uniqueKey);
            } else if (typeof metaFields[key] === 'object' && Object.keys(metaFields[key]).length > 0) {
                // Store object meta fields
               storeObjectMetaFields([key], metaFields[key]);
            }
        }
    };

    const storeObjectMetaFields = (keys, value) => {
        const runLoopInner = (key) => {
            if(typeof value[key] === 'string'){
                const uniqueKey = 'metaFields_lmat_' + keys.join('_lmat_bulk_content_temp_')+'_lmat_bulk_content_temp_'+key;
                updatedKeys.push(uniqueKey);
            }else if(typeof value[key] === 'object' && Object.keys(value[key]).length > 0){
                // Store object meta fields
                storeObjectMetaFields([...keys, key], value[key]);
            }
        }

        LoopCallback({callback: runLoopInner, loop: Object.keys(value), index: 0});
    }

    if(metaFields && Object.keys(metaFields).length > 0){
        LoopCallback({callback: metaFieldsLoop, loop: Object.keys(metaFields), index: 0});
    } 

    return updatedKeys;
}

export default updateMetafieldsKeys;