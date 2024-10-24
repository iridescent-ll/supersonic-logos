package com.tencent.supersonic.headless.server.persistence.mapper;

import com.tencent.supersonic.headless.server.persistence.dataobject.DimensionDO;
import com.tencent.supersonic.headless.server.pojo.DimensionFilter;
import com.tencent.supersonic.headless.server.pojo.DimensionsFilter;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DimensionDOCustomMapper {

    void batchInsert(List<DimensionDO> dimensionDOS);

    void batchUpdate(List<DimensionDO> dimensionDOS);

    void batchUpdateStatus(List<DimensionDO> dimensionDOS);

    List<DimensionDO> query(DimensionFilter dimensionFilter);

    List<DimensionDO> queryDimensions(DimensionsFilter dimensionsFilter);
}
