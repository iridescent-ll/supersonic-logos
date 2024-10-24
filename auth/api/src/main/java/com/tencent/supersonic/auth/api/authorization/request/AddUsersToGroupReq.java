package com.tencent.supersonic.auth.api.authorization.request;

import lombok.Data;

import java.util.List;

@Data
public class AddUsersToGroupReq {

    private Integer groupId;
    private List<String> users;
}
