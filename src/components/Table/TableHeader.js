import React from 'react';
import {TableCell, TableHeader} from "@windmill/react-ui";

const Header = () => {
    return (
        <TableHeader>
            <tr className="text-center">
                <TableCell>Partner</TableCell>
                <TableCell>Ext ID</TableCell>
                <TableCell>Trans ID</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
            </tr>
        </TableHeader>
    );
};

export default Header;
