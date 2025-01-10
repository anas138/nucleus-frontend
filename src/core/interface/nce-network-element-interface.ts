export interface INceNetworkElement {
    resource_id: string;
    is_virtual: boolean;
    ip_address: string;
    is_gateway: number;
    is_in_ac_domain: boolean;
    physical_id: number;
    container: boolean;
    patch_version: null | string;
    pre_config: number;
    product_name: string;
    user_label: string;
    ref_parent_subnet: string;
    software_version: string;
    gateway_id_list: null | any[]; // You can replace `any[]` with a more specific type
    manufacturer: string;
    remark: string;
    name: string;
    hardware_version: string;
    detail_dev_type_name: string;
    communication_state: null | any; // You can replace `any` with a more specific type
    alias: string;
    enable_ason: number;
    admin_status: string;
    nce_create_time: string;
    nce_last_modified: string;
    created_on: string;
    region_id: null | string;
    ne_reference_id: null | string;
}