package com.tencent.supersonic.headless.api.pojo.request;

import javax.validation.constraints.NotNull;

import com.tencent.supersonic.headless.api.pojo.SchemaElementType;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@ToString
@Data
public class TagBatchCreateReq {
    @NotNull
    private Long modelId;
    private SchemaElementType type;
    private List<Long> itemIds;
}
